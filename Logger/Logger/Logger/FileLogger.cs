using System;
using System.IO;

namespace Logger.Logger
{
    public class FileLogger
    {
        private static readonly FileLogger _fileLogger = new FileLogger();

        // CORRECTION: Lock object for thread safety
        private static readonly object _lock = new object();

        private FileLogger() { }

        public static FileLogger CurrentLogger
        {
            get { return _fileLogger; }
        }

        // Returns the path so we can see where it wrote
        public string Log(string message)
        {
            // This puts the Logs folder in your project's output directory (bin/Debug/net8.0/)
            string logDirectory = Path.Combine(AppContext.BaseDirectory, "Logs");
            string path = Path.Combine(logDirectory, "log.txt");

            // CORRECTION: Use lock to prevent "File in use" errors during simultaneous requests
            lock (_lock)
            {
                if (!Directory.Exists(logDirectory))
                {
                    Directory.CreateDirectory(logDirectory);
                }

                using (var writer = new StreamWriter(path, true))
                {
                    writer.WriteLine($"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] {message}");
                }
            }

            // Print exact path to Console so you know where to look
            Console.WriteLine($"[LOGGER] Wrote to file: {path}");

            return path;
        }
    }
}