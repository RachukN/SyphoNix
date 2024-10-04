using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Spotify.Models; // Ваші моделі
using Microsoft.AspNetCore.Identity;
using Spotify.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Logging.AddConsole();

// Додайте контекст бази даних ApplicationDbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Додайте контекст бази даних для ImgServer (ImgServerDbContext)
builder.Services.AddDbContext<ImgServerDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ImgServerConnection")));

// Налаштування Identity для користувачів (ApplicationUser)
builder.Services.AddDefaultIdentity<ApplicationUser>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

// Додати кастомний сервіс (наприклад, для роботи з користувачами)
builder.Services.AddScoped<UserService>();

// Swagger конфігурація для документування API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Spotify Auth API", Version = "v1" });

    // Додаємо Bearer токен авторизації
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    // Операційний фільтр для завантаження кількох файлів (якщо потрібен)
    c.OperationFilter<MultipleFileUploadOperation>();
});

// Додаємо HttpClient для роботи з HTTP-запитами
builder.Services.AddHttpClient();

// Конфігурація CORS для взаємодії з фронтендом
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:1573") // Вказуємо дозволене джерело
              .AllowAnyHeader()                    // Дозволяємо будь-які заголовки
              .AllowAnyMethod()                    // Дозволяємо будь-які методи (GET, POST, PUT, тощо)
              .AllowCredentials();                 // Дозволяємо передачу куків
    });
});

// Додаємо контролери (для MVC)
builder.Services.AddControllers();

var app = builder.Build();

// Налаштування під час розробки
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); // Сторінка для відлагодження помилок
    app.UseSwagger(); // Додаємо Swagger для документування API
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Spotify Auth API v1")); // Swagger UI
}

// Використання HTTPS перенаправлення
app.UseHttpsRedirection();

// Використання статичних файлів (якщо потрібно)
app.UseStaticFiles();

// Застосовуємо CORS політику, яку ми налаштували
app.UseCors("AllowFrontend");

// Налаштування аутентифікації та авторизації
app.UseAuthentication(); // Додаємо аутентифікацію
app.UseAuthorization();  // Додаємо авторизацію

// Додаємо глобальну обробку помилок (щоб ловити всі винятки)
app.Use(async (context, next) =>
{
    try
    {
        await next.Invoke(); // Викликаємо наступний middleware
    }
    catch (Exception ex)
    {
        // Логування помилки або відображення повідомлення
        context.Response.StatusCode = 500; // Встановлюємо статус код 500 (помилка сервера)
        await context.Response.WriteAsync("An unexpected error occurred."); // Виводимо повідомлення
    }
});

// Налаштування маршрутизації для контролерів
app.MapControllers();

// Запуск застосунку
app.Run();
