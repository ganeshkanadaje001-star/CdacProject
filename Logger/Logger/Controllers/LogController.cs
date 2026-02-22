
using Logger.Logger;
using Logger.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Logger.Controllers
{
    [ApiController]
    [Route("api")]
    public class LogController : ControllerBase
    {
        [HttpPost("logs")]
        public IActionResult Log([FromBody] LogRequest request)
        {
            Console.WriteLine($"[API HIT] Received log request: {request.Message}");

            // Call the logger
            string savedPath = FileLogger.CurrentLogger.Log(
                $"[{request.Level}] [{request.Source}] {request.Message} | Data: {request.Data}"
            );

            // Return the path in the response for debugging purposes
            return Ok(new { message = "Log saved successfully", filePath = savedPath });
        }
    }
}
