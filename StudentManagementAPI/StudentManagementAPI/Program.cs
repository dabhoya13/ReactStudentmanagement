using Microsoft.Extensions.FileProviders;
using StudentManagementAPI.MapperConfig;
using StudentManagementAPI.Services;
using System.Net;

var builder = WebApplication.CreateBuilder(args);
ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls13;
HttpClientHandler clientHandler = new HttpClientHandler();
clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };

// Pass the handler to httpclient(from you are calling api)
HttpClient client = new HttpClient(clientHandler);
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    // Configure session options as needed (optional)
    options.IdleTimeout = TimeSpan.FromHours(2);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
builder.Services.AddDataProtection();
builder.Services.AddDataLayerServices();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IJwtServices, JwtServices>();
builder.Services.AddAutoMapper(typeof(MapperConfig));
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
            builder =>
            {
                builder.WithOrigins("https://localhost:7137") // Specify your MVC app's origin
                       .AllowAnyMethod()
                       .AllowAnyHeader()
                       .AllowCredentials(); // Allow credentials

                builder.WithOrigins("https://localhost:7199") // Backend origin
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();

                builder.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:3001")
                      .AllowAnyMethod()
                      .AllowAnyHeader()
                      .AllowCredentials();

            });
});

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(),"wwwroot", "Uploads", "NoticeImages")),
    RequestPath = "/NoticeImages"
});
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(),"wwwroot", "Uploads", "StudentProfiles")),
    RequestPath = "/StudentProfiles"
});
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads", "HodProfiles")),
    RequestPath = "/HodProfiles"
});
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseRouting();
app.UseSession();
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
