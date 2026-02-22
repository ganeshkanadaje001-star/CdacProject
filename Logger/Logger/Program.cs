using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// CORRECTION: Enable CORS so your Frontend (React/Angular/HTML) can hit this API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()  // Allows requests from anywhere (localhost:3000, etc.)
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();

// CORRECTION: Apply the CORS policy
app.UseCors("AllowAll");

app.MapControllers();

app.Run();