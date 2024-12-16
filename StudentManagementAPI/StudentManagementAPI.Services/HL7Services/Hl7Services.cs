using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Task = System.Threading.Tasks.Task;

namespace StudentManagementAPI.Services.HL7Services
{
    public class Hl7Services : IHl7Services
    {
        private readonly FhirClient _fhirClient;
        public Hl7Services(IConfiguration _configuration)
        {


            var baseUrl = _configuration["FHIRServer:BaseUrl"];
            var apiKey = _configuration["FHIRServer:ApiKey"];

            var settings = new FhirClientSettings
            {
                PreferredFormat = ResourceFormat.Json,
                Timeout = 10000 // Optional timeout
            };

            _fhirClient = new FhirClient(baseUrl, settings);
            _fhirClient.RequestHeaders.Add("Authorization", $"Bearer {apiKey}");

        }

        public async Task<Patient> GetPatientByIdAsync(string patientId)
        {
            try
            {
                return await _fhirClient.ReadAsync<Patient>($"Patient/{patientId}");
            }
            catch (Exception ex)
            {
                throw new Exception($"Error fetching Patient data: {ex.Message}");
            }
        }

        public async Task<Observation> GetObservationAsync(string observationId)
        {
            try
            {
                return await _fhirClient.ReadAsync<Observation>($"Observation/{observationId}");
            }
            catch (Exception ex)
            {
                throw new Exception($"Error fetching Observation data: {ex.Message}");
            }
        }
        public async Task<string> CreateObservationAsync()
        {
            try
            {
                var observation = new Observation
                {
                    Status = ObservationStatus.Final,
                    Code = new CodeableConcept
                    {
                        Coding = new List<Coding>
                        {
                            new Coding
                            {
                                System = "http://loinc.org",
                                Code = "29463-7",
                                Display = "Body Weight"
                            }
                        },
                        Text = "Body Weight"
                    },
                    Value = new Quantity
                    {
                        Value = 72.5m, // Example value
                        Unit = "kg",
                        System = "http://unitsofmeasure.org",
                        Code = "kg"
                    }
                };

                var result = await _fhirClient.CreateAsync(observation);
                return result?.Id ?? string.Empty;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error creating Observation: {ex.Message}");
            }
        }

        public async Task<string> GenerateObservationHL7Message(Patient patient, Observation observation)
        {
            var hl7Message =
                $"MSH|^~\\&|YourApp|YourFacility|eCW|DestinationApp|{DateTime.Now:yyyyMMddHHmmss}||ORU^R01|123456|P|2.3.1|" +
                $"PID|1||{patient.Id}|{patient.Name}^||19700101|M|||{patient.Address}|" +
                $"OBR|1|{observation.Id}|ObservationCode|29463-7|Body Weight|||{DateTime.Now:yyyyMMddHHmmss}|||||Final|" +
                $"OBX|1|NM|29463-7|Body Weight|72.5|kg|72.5|kg|||||F";

            return hl7Message;
        }

        public async Task SendHL7MessageAsync(string hl7Message)
        {
            var serverIp = "192.168.x.x"; // Replace with the eCW HL7 listener's IP.
            var serverPort = 2575;       // Replace with the port eCW listens on.

            using (var client = new TcpClient())
            {
                await client.ConnectAsync(serverIp, serverPort);

                using (var networkStream = client.GetStream())
                {
                    var buffer = Encoding.UTF8.GetBytes(hl7Message + "\r");
                    await networkStream.WriteAsync(buffer, 0, buffer.Length);
                }
            }
        }

        public async Task StartListeningAsync()
        {
            var listener = new TcpListener(IPAddress.Any, 2575); // Listening on port 2575
            listener.Start();
            Console.WriteLine("Listening for incoming HL7 messages on port 2575...");

            while (true)
            {
                var client = await listener.AcceptTcpClientAsync();
                _ = HandleClientAsync(client);
            }
        }

        private async Task HandleClientAsync(TcpClient client)
        {
            try
            {
                using (var stream = client.GetStream())
                {
                    var buffer = new byte[1024];
                    var bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length);

                    if (bytesRead > 0)
                    {
                        var hl7Message = Encoding.UTF8.GetString(buffer, 0, bytesRead);
                        Console.WriteLine($"Received HL7 Message: {hl7Message}");

                        // Parse the HL7 message here
                        ParsePatientData(hl7Message);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error handling client connection: {ex.Message}");
            }
            finally
            {
                client.Close();
            }
        }

        public Dictionary<string, string> ParsePatientData(string hl7Message)
        {
            try
            {
                var segments = hl7Message.Split('|');

                string patientId = string.Empty;
                string patientName = string.Empty;
                string patientDOB = string.Empty;
                string patientGender = string.Empty;

                string observationCode = string.Empty;
                string observationValue = string.Empty;
                string observationUnit = string.Empty;

                // Process each segment
                for (int i = 0; i < segments.Length; i++)
                {
                    // Process PID segment for patient demographics
                    if (segments[i].StartsWith("PID", StringComparison.OrdinalIgnoreCase))
                    {
                        // Extract data assuming fields follow the HL7 standard
                        if (i + 1 < segments.Length) // Ensure index exists
                        {
                            var pidFields = segments[i + 1].Split('|');
                            patientId = pidFields[0];
                        }
                    }
                }
                return new Dictionary<string, string>
                {
                    { "PatientId", patientId },
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing HL7 message: {ex.Message}");
                return null;
            }
        }

    }
}
