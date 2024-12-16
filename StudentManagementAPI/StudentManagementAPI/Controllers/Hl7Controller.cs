using Hl7.Fhir.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.Services.HL7Services;

namespace StudentManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Hl7Controller : ControllerBase
    {
        private readonly IHl7Services _hl7Services;

        public Hl7Controller(IHl7Services hl7Services)
        {
            _hl7Services = hl7Services;
        }

        [HttpGet("patient/{id}")]
        public async Task<IActionResult> GetPatientById(string id)
        {
            try
            {
                var patient = await _hl7Services.GetPatientByIdAsync(id);
                return Ok(patient);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("observation/{id}")]
        public async Task<IActionResult> GetObservation(string id)
        {
            try
            {
                var observation = await _hl7Services.GetObservationAsync(id);
                return Ok(observation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("observation")]
        public async Task<IActionResult> CreateObservation()
        {
            try
            {
                var createdObservationId = await _hl7Services.CreateObservationAsync();
                return Ok(new { observationId = createdObservationId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("ExportData")]
        public async Task<IActionResult> ExportData(string patientId,string observationId)
        {
            try
            {
                var patient = await _hl7Services.GetPatientByIdAsync(patientId);
                var observation = await _hl7Services.GetObservationAsync(observationId);

                var hl7Message = await _hl7Services.GenerateObservationHL7Message(patient, observation);

                // Send via TCP/IP
                //await _hl7Services.SendHL7MessageAsync(hl7Message);
                return Ok(hl7Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("ParseHl7Message")]
        public async Task<IActionResult> ParseHl7Message(string hl7Message)
        {
            try
            {
                Dictionary<string,string> parseMessage = _hl7Services.ParsePatientData(hl7Message);
                return Ok(parseMessage);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
