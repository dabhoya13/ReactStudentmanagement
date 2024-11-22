using StudentManagementAPI.Services;

var builder = WebApplication.CreateBuilder(args);

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
    options.IdleTimeout = TimeSpan.FromMinutes(1);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
builder.Services.AddDataProtection();
builder.Services.AddDataLayerServices();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IJwtServices, JwtServices>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
            builder =>
            {
                builder.WithOrigins("https://localhost:7137") // Specify your MVC app's origin
                       .AllowAnyMethod()
                       .AllowAnyHeader()
                       .AllowCredentials(); // Allow credentials

                builder.WithOrigins("http://localhost:5173")
                      .AllowAnyMethod()
                      .AllowAnyHeader()
                      .AllowCredentials();
            });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowSpecificOrigin");
app.UseRouting();
app.UseSession();
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
