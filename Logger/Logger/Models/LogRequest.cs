namespace Logger.Models
{
    public class LogRequest
    {
        public required string Level { get; set; }
        public required string Message { get; set; }
        public required string Source { get; set; }
        public string? Data { get; set; }
    }
}