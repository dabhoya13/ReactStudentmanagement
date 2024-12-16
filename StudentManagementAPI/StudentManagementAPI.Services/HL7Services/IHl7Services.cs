using Hl7.Fhir.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task = System.Threading.Tasks.Task;

namespace StudentManagementAPI.Services.HL7Services
{
    public interface IHl7Services
    {
        Task<Patient> GetPatientByIdAsync(string patientId);
        Task<Observation> GetObservationAsync(string observationId);
        Task<string> CreateObservationAsync();

        Task<string> GenerateObservationHL7Message(Patient patient, Observation observation);

        Task SendHL7MessageAsync(string hl7Message);

        Dictionary<string, string> ParsePatientData(string hl7Message);
    }
}
