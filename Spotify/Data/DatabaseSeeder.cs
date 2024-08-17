using Core.Entities;
using Core.Entities.Identity;
using Core.Resources.Constants;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Infastructure
{
    public static class DatabaseSeeder
    {
        public static async Task SeedDataAsync(this IApplicationBuilder app)
        {
            using (var scope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var service = scope.ServiceProvider;
                var context = service.GetRequiredService<DatabaseContext>();
                var userNamager = service.GetRequiredService<UserManager<UserEntity>>();

                if (!context.Roles.Any())
                {
                    RoleEntity userRoleEntity = new RoleEntity()
                    {
                        Id = 1,
                        Name = Roles.User,
                        NormalizedName = Roles.User.ToUpper()
                    };
                    await context.Roles.AddAsync(userRoleEntity);
                    await context.SaveChangesAsync();

                    RoleEntity adminRoleEntity = new RoleEntity()
                    {
                        Id = 2,
                        Name = Roles.Admin,
                        NormalizedName = Roles.Admin.ToUpper()
                    };
                    await context.Roles.AddAsync(adminRoleEntity);
                    await context.SaveChangesAsync();
                }
                if (!context.Users.Any())
                {
                    var radiohead = new UserEntity()
                    {
                        FirstName = "Thom",
                        LastName = "Yorke",
                        UserName = "RadioHead",
                        PublicPerformerNickName = "Radiohead",
                        AboutMe = "Radiohead are an English rock band formed in Abingdon, Oxfordshire, in 1985.",
                        Image = "radiohead.jpg",
                        Email = "radiohead@gmail.com",
                        IsDeleted = false,
                        IsBloked = false,
                        IsVerified = true,
                        EmailConfirmed = true,
                        UniqueVerifiacationCode = Guid.NewGuid().ToString(),
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                    };
                    var radioheadResult = await userNamager.CreateAsync(radiohead, "Qwertyuiop123@D!#da");
                    if (radioheadResult.Succeeded)
                        await userNamager.AddToRoleAsync(radiohead, Roles.User);

                    var painoboy = new UserEntity()
                    {
                        FirstName = "Dmytro",
                        LastName = "Shurov",
                        UserName = "pianoboy",
                        PublicPerformerNickName = "Pianoбой",
                        AboutMe = "Pianoboy",
                        Image = "painoboy.jpg",
                        Email = "pianoboy@gmail.com",
                        IsDeleted = false,
                        IsBloked = false,
                        IsVerified = true,
                        EmailConfirmed = true,
                        UniqueVerifiacationCode = Guid.NewGuid().ToString(),
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                    };
                    var painoboyResult = await userNamager.CreateAsync(painoboy, "Qwertyuiop123@D!#da");
                    if (painoboyResult.Succeeded)
                        await userNamager.AddToRoleAsync(painoboy, Roles.User);

                    var skay = new UserEntity()
                    {
                        FirstName = "Skay",
                        LastName = "Skay",
                        UserName = "skay",
                        PublicPerformerNickName = "Скай",
                        AboutMe = "skay",
                        Image = "skay.jpg",
                        Email = "skay@gmail.com",
                        IsDeleted = false,
                        IsBloked = false,
                        IsVerified = true,
                        EmailConfirmed = true,
                        UniqueVerifiacationCode = Guid.NewGuid().ToString(),
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                    };
                    var skayResult = await userNamager.CreateAsync(skay, "Qwertyuiop123@D!#da");
                    if (skayResult.Succeeded)
                        await userNamager.AddToRoleAsync(skay, Roles.User);

                    var coldPlay = new UserEntity()
                    {
                        FirstName = "Coldplay",
                        LastName = "ColdPlay",
                        UserName = "coldplay",
                        PublicPerformerNickName = "Coldplay",
                        AboutMe = "coldplay",
                        Image = "coldplay.jpg",
                        Email = "coldplay@gmail.com",
                        IsDeleted = false,
                        IsBloked = false,
                        IsVerified = true,
                        EmailConfirmed = true,
                        UniqueVerifiacationCode = Guid.NewGuid().ToString(),
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                    };
                    var coldplayResult = await userNamager.CreateAsync(coldPlay, "Qwertyuiop123@D!#da");
                    if (coldplayResult.Succeeded)
                        await userNamager.AddToRoleAsync(coldPlay, Roles.User);

                    var skryabin = new UserEntity()
                    {
                        FirstName = "Андрій",
                        LastName = "Кузьменко",
                        UserName = "skryabin",
                        PublicPerformerNickName = "Skryabin",
                        AboutMe = "Український музичний гурт, що за час своєї творчої активності пройшов шлях від синті-попу, постпанку і техно до поп-року.",
                        Image = "skryabin.jpg",
                        Email = "skryabin@gmail.com",
                        IsDeleted = false,
                        IsBloked = false,
                        IsVerified = true,
                        EmailConfirmed = true,
                        UniqueVerifiacationCode = Guid.NewGuid().ToString(),
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                    };
                    var skryabinResult = await userNamager.CreateAsync(skryabin, "Qwertyuiop123@D!#da");
                    if (skryabinResult.Succeeded)
                        await userNamager.AddToRoleAsync(skryabin, Roles.User);

                    var mistmorn = new UserEntity()
                    {
                        FirstName = "Роман",
                        LastName = "Єфімов",
                        UserName = "mistmorn",
                        PublicPerformerNickName = "Mistmorn",
                        AboutMe = "Український виконавець пісень у стилі постпанк та Lo-Fi.",
                        Image = "mistmorn.jpg",
                        Email = "mistmorn@gmail.com",
                        IsDeleted = false,
                        IsBloked = false,
                        IsVerified = true,
                        EmailConfirmed = true,
                        UniqueVerifiacationCode = Guid.NewGuid().ToString(),
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                    };
                    var mistmornResult = await userNamager.CreateAsync(mistmorn, "Qwertyuiop123@D!#da");
                    if (mistmornResult.Succeeded)
                        await userNamager.AddToRoleAsync(mistmorn, Roles.User);

                    var patric = new UserEntity()
                    {
                        FirstName = "Patric",
                        LastName = "Waston",
                        UserName = "patricwaston",
                        PublicPerformerNickName = "Patric Waston",
                        AboutMe = "Patrick Watson is an American-born Canadian singer-songwriter from Montreal, Quebec.",
                        Image = "patricwaston.jpg",
                        Email = "patricwaston@gmail.com",
                        IsDeleted = false,
                        IsBloked = false,
                        IsVerified = true,
                        EmailConfirmed = true,
                        UniqueVerifiacationCode = Guid.NewGuid().ToString(),
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                    };
                    var patricResult = await userNamager.CreateAsync(patric, "Qwertyuiop123@D!#da");
                    if (patricResult.Succeeded)
                        await userNamager.AddToRoleAsync(patric, Roles.User);

                    var cults = new UserEntity()
                    {
                        FirstName = "Cults",
                        LastName = "Cults",
                        UserName = "cults",
                        PublicPerformerNickName = "Cults",
                        AboutMe = "Cults is an American indie rock band formed in New York City in 2010.",
                        Image = "cults.jpg",
                        Email = "cults@gmail.com",
                        IsDeleted = false,
                        IsBloked = false,
                        IsVerified = true,
                        EmailConfirmed = true,
                        UniqueVerifiacationCode = Guid.NewGuid().ToString(),
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                    };
                    var cultsResult = await userNamager.CreateAsync(cults, "Qwertyuiop123@D!#da");
                    if (cultsResult.Succeeded)
                        await userNamager.AddToRoleAsync(cults, Roles.User);

                    var roar = new UserEntity()
                    {
                        FirstName = "Roar",
                        LastName = "Roar",
                        UserName = "roar",
                        PublicPerformerNickName = "Roar",
                        AboutMe = "Roar (stylized as ROAR) is an American solo musical project of Arizona-based musician Owen Evans.",
                        Image = "roar.jpg",
                        Email = "roar@gmail.com",
                        IsDeleted = false,
                        IsBloked = false,
                        IsVerified = true,
                        EmailConfirmed = true,
                        UniqueVerifiacationCode = Guid.NewGuid().ToString(),
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                    };
                    var roarResult = await userNamager.CreateAsync(roar, "Qwertyuiop123@D!#da");
                    if (roarResult.Succeeded)
                        await userNamager.AddToRoleAsync(roar, Roles.User);

                    var lianaFlores = new UserEntity()
                    {
                        FirstName = "Liana",
                        LastName = "Flores",
                        UserName = "lianaflores",
                        PublicPerformerNickName = "Liana Flores",
                        AboutMe = "Liana Flores, an indie pop singer and YouTuber",
                        Image = "liana.jpg",
                        Email = "liana@gmail.com",
                        IsDeleted = false,
                        IsBloked = false,
                        IsVerified = true,
                        EmailConfirmed = true,
                        UniqueVerifiacationCode = Guid.NewGuid().ToString(),
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                    };
                    var lianaFloresResult = await userNamager.CreateAsync(lianaFlores, "Qwertyuiop123@D!#da");
                    if (lianaFloresResult.Succeeded)
                        await userNamager.AddToRoleAsync(lianaFlores, Roles.User);

                    var waterHouse = new UserEntity()
                    {
                        FirstName = "Water",
                        LastName = "House",
                        UserName = "waterhouse",
                        PublicPerformerNickName = "Waterhouse",
                        AboutMe = "waterhouse",
                        Image = "waterhouse.jpg",
                        Email = "waterhouse@gmail.com",
                        IsDeleted = false,
                        IsBloked = false,
                        IsVerified = true,
                        EmailConfirmed = true,
                        UniqueVerifiacationCode = Guid.NewGuid().ToString(),
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                    };
                    var waterHouseResult = await userNamager.CreateAsync(waterHouse, "Qwertyuiop123@D!#da");
                    if (waterHouseResult.Succeeded)
                        await userNamager.AddToRoleAsync(waterHouse, Roles.User);

                    var matt = new UserEntity()
                    {
                        FirstName = "Matt",
                        LastName = "Maltese",
                        UserName = "matt",
                        PublicPerformerNickName = "Matt Maltese",
                        AboutMe = "Matthew Jonathan Gordon Maltese is a British-Canadian singer-songwriter. ",
                        Image = "matt.jpg",
                        Email = "matt@gmail.com",
                        IsDeleted = false,
                        IsBloked = false,
                        IsVerified = true,
                        EmailConfirmed = true,
                        UniqueVerifiacationCode = Guid.NewGuid().ToString(),
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                    };
                    var mattResult = await userNamager.CreateAsync(matt, "Qwertyuiop123@D!#da");
                    if (mattResult.Succeeded)
                        await userNamager.AddToRoleAsync(matt, Roles.User);

                    var mac = new UserEntity()
                    {
                        FirstName = "Mac",
                        LastName = "DeMarko",
                        UserName = "macDeMarko",
                        PublicPerformerNickName = "Mac DeMarco",
                        AboutMe = "MacBriare Samuel Lanyon DeMarco is a Canadian singer, songwriter, multi-instrumentalist and producer.",
                        Image = "macDeMarko.jpg",
                        Email = "mac@gmail.com",
                        IsDeleted = false,
                        IsBloked = false,
                        IsVerified = true,
                        EmailConfirmed = true,
                        UniqueVerifiacationCode = Guid.NewGuid().ToString(),
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                    };
                    var macResult = await userNamager.CreateAsync(mac, "Qwertyuiop123@D!#da");
                    if (macResult.Succeeded)
                        await userNamager.AddToRoleAsync(mac, Roles.User);

                    var yana = new UserEntity()
                    {
                        FirstName = "Яна",
                        LastName = "Коваль",
                        UserName = "yana.koval",
                        PublicPerformerNickName = "Яна Коваль",
                        Image = "yana.jpg",
                        Email = "yana@gmail.com",
                        AboutMe = " ",
                        IsDeleted = false,
                        IsBloked = false,
                        IsVerified = true,
                        EmailConfirmed = true,
                        FavoritePlaylistCode = 1,
                        UniqueVerifiacationCode = Guid.NewGuid().ToString(),
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                    };
                    var yanaResult = await userNamager.CreateAsync(yana, "Qwertyuiop123@D!#da");
                    if (yanaResult.Succeeded)
                        await userNamager.AddToRoleAsync(mac, Roles.User);

                    var lana = new UserEntity()
                    {
                        FirstName = "Elizabeth",
                        LastName = "Woolridge",
                        UserName = "LanaDelRey",
                        PublicPerformerNickName = "Lana Del Rey",
                        AboutMe = "Elizabeth Woolridge Grant, known professionally as Lana Del Rey, is an American singer-songwriter", 
                        Image = "lana.jpg",
                        Email = "lana@gmail.com",
                        IsDeleted = false,
                        IsBloked = false,
                        IsVerified = true,
                        EmailConfirmed = true,
                        FavoritePlaylistCode = 2,
                        UniqueVerifiacationCode = Guid.NewGuid().ToString(),
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                    };
                    var lanaResult = await userNamager.CreateAsync(lana, "Qwertyuiop123@D!#da");
                    if (lanaResult.Succeeded)
                        await userNamager.AddToRoleAsync(lana, Roles.User);

                    var moderator = new UserEntity()
                    {
                        FirstName = "Moderator",
                        LastName = "Moderatovich",
                        UserName = "moderator",
                        PublicPerformerNickName = " ",
                        AboutMe = " ",
                        Image = "1.default-user-icon.jpg",
                        Email = "moderator@gmail.com",
                        IsDeleted = false,
                        IsBloked = false,
                        IsVerified = true,
                        EmailConfirmed = true,
                        UniqueVerifiacationCode = Guid.NewGuid().ToString(),
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                    };
                    var moderatorResult = await userNamager.CreateAsync(moderator, "QWertyuip@243KfdsokHkncd&4234KJcds");
                    if (moderatorResult.Succeeded)
                        await userNamager.AddToRoleAsync(moderator, Roles.Admin);

                }
                if (!context.Albums.Any())
                {
                    Album ocean = new Album()
                    {
                        Title = "Ocean Blud",
                        NormalizedTitle = "OCEAN BLUD",
                        UserName = "LanaDelRey",
                        GenreId = 1,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Image = "ocean.jpg",
                        Description = "Альбом",
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = true,
                    };
                    await context.Albums.AddAsync(ocean);
                    await context.SaveChangesAsync();

                    Album ces = new Album()
                    {
                        Title = "Ces La Vie",
                        NormalizedTitle = "CES LA VIE",
                        UserName = "LanaDelRey",
                        GenreId = 1,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Image = "ces.jpg",
                        Description = "Альбом",
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = true,
                    };
                    await context.Albums.AddAsync(ces);
                    await context.SaveChangesAsync();

                    Album didyou = new Album()
                    {
                        Title = "Did you know that there are tunnel",
                        NormalizedTitle = "DID YOU KNOW THAT THERE ARE TUNNEL",
                        UserName = "LanaDelRey",
                        GenreId = 1,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Image = "didyouknow.jpg",
                        Description = "Альбом",
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = true,
                    };
                    await context.Albums.AddAsync(didyou);
                    await context.SaveChangesAsync();

                    Album newLana = new Album()
                    {
                        Title = "New Lana",
                        NormalizedTitle = "NEW LANA",
                        UserName = "LanaDelRey",
                        GenreId = 1,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Image = "eyes.jpg",
                        Description = "Альбом",
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = true,
                    };
                    await context.Albums.AddAsync(newLana);
                    await context.SaveChangesAsync();

                    Album paradise = new Album()
                    {
                        Title = "The Paradasi",
                        NormalizedTitle = "THE PARADASI",
                        UserName = "LanaDelRey",
                        GenreId = 1,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Image = "borntodie.jpg",
                        Description = "Альбом",
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = true,
                    };
                    await context.Albums.AddAsync(paradise);
                    await context.SaveChangesAsync();

                    Album ultraviolence = new Album()
                    {
                        Title = "Ultraviolence",
                        NormalizedTitle = "ULTRAVIOLENCE",
                        UserName = "LanaDelRey",
                        GenreId = 1,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Image = "Ultraviolence.jpg",
                        Description = "Альбом",
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = true,
                    };
                    await context.Albums.AddAsync(ultraviolence);
                    await context.SaveChangesAsync();

                    Album complete = new Album()
                    {
                        Title = "Complete",
                        NormalizedTitle = "COMPLETE",
                        UserName = "LanaDelRey",
                        GenreId = 1,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Image = "complete.jpg",
                        Description = "Альбом",
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = true,
                    };
                    await context.Albums.AddAsync(complete);
                    await context.SaveChangesAsync();

                    Album lanaDel = new Album()
                    {
                        Title = "Del Rey",
                        NormalizedTitle = "DEL REY",
                        UserName = "LanaDelRey",
                        GenreId = 1,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Image = "lanablack2.jpg",
                        Description = "Останій реліз",
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = true,
                    };
                    await context.Albums.AddAsync(lanaDel);
                    await context.SaveChangesAsync();

                    Album hollywood = new Album()
                    {
                        Title = "Hollywood Bowl",
                        NormalizedTitle = "HOLLYWOOD BOWL",
                        UserName = "LanaDelRey",
                        GenreId = 1,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Image = "ocean2.jpg",
                        Description = "Останій реліз",
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = true,
                    };
                    await context.Albums.AddAsync(hollywood);
                    await context.SaveChangesAsync();

                    Album bornToDie = new Album()
                    {
                        Title = "Born To Die",
                        NormalizedTitle = "BORN TO DIE",
                        UserName = "LanaDelRey",
                        GenreId = 1,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Image = "354f02b4fac13b97489c6166e4de81e8.jpg",
                        Description = "Альбом",
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = true,
                    };
                    await context.Albums.AddAsync(bornToDie);
                    await context.SaveChangesAsync();

                    Album sirens = new Album()
                    {
                        Title = "Sirens",
                        NormalizedTitle = "SIRENS",
                        UserName = "LanaDelRey",
                        GenreId = 1,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Image = "fire.jpg",
                        Description = "Альбом",
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = true,
                    };
                    await context.Albums.AddAsync(sirens);
                    await context.SaveChangesAsync();

                    Album normal = new Album()
                    {
                        Title = "Norman Rockwell!",
                        NormalizedTitle = "NORMAN ROCKWELL!",
                        UserName = "LanaDelRey",
                        GenreId = 1,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Image = "lanaBlack.jpg",
                        Description = "Альбом",
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = true,
                    };
                    await context.Albums.AddAsync(normal);
                    await context.SaveChangesAsync();

                    Album salvatore = new Album()
                    {
                        Title = "Salvatore",
                        NormalizedTitle = "SALVATORE",
                        UserName = "LanaDelRey",
                        GenreId = 1,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Image = "lanaRed.jpg",
                        Description = "Альбом",
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = true,
                    };
                    await context.Albums.AddAsync(salvatore);
                    await context.SaveChangesAsync();
                }
                if (!context.Genres.Any())
                {
                    List<string> genreNames = new List<string>
                    {
                        "Рок", "Метал", "Кантрі", "Вечірка", "Любов", "Епохи",
                        "Аніме", "Джаз", "Классика", "Ігри", "Дитяче", "Подорож",
                        "Літо", "Навчання", "Акустика", "Реп", "Спокій", "Сон",
                        "Фанк", "Блюз", "Ембієнт", "Панк", "Удома"
                    };

                    foreach (string genreName in genreNames)
                    {
                        Genre genre = new Genre()
                        {
                            Name = genreName,
                            NoramlizedName = genreName.ToUpper(),
                            DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                            IsDeleted = false,
                        };

                        await context.Genres.AddAsync(genre);
                    }

                    await context.SaveChangesAsync();
                }

                if (!context.Tracks.Any())
                {
                    Track creep = new Track()
                    {
                        Title = "Creep",
                        NormalizedTitle = "CREEP",
                        PerformerUserName = "RadioHead",
                        GenreId = 1,
                        Duration = 236,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Path = "Creep.mp3",
                        Image = "creep.jpg",
                        PublicPerformerNickName = "Radiohead",
                        CountListened = 322345,
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = true,
                    };
                    await context.Tracks.AddAsync(creep);
                    await context.SaveChangesAsync();

                    Track noSurprises = new Track()
                    {
                        Title = "No Surprises",
                        NormalizedTitle = "NO SURPRISES",
                        PerformerUserName = "RadioHead",
                        GenreId = 1,
                        Duration = 236,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Path = "No Surprises.mp3",
                        Image = "noSuprises.jpg",
                        PublicPerformerNickName = "Radiohead",
                        CountListened = 124432,
                        IsDeleted = false,
                        IsExplicit = true,
                        IsPublic = true,
                    };
                    await context.Tracks.AddAsync(noSurprises);
                    await context.SaveChangesAsync();

                    Track karma = new Track()
                    {
                        Title = "Karma Police",
                        NormalizedTitle = "KARMA POLICE",
                        PerformerUserName = "RadioHead",
                        GenreId = 1,
                        Duration = 264,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Path = "Karma Police.mp3",
                        Image = "KarmaPolice.jpg",
                        PublicPerformerNickName = "Radiohead",
                        CountListened = 854345,
                        IsDeleted = false,
                        IsExplicit = true,
                        IsPublic = true,
                    };
                    await context.Tracks.AddAsync(karma);
                    await context.SaveChangesAsync();

                    Track high = new Track()
                    {
                        Title = "High and Dry",
                        NormalizedTitle = "HIGH AND DRY",
                        PerformerUserName = "RadioHead",
                        GenreId = 1,
                        Duration = 256,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Path = "High and Dry.mp3",
                        Image = "HighAndDry.jpg",
                        PublicPerformerNickName = "Radiohead",
                        CountListened = 123143,
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = true,
                    };
                    await context.Tracks.AddAsync(high);
                    await context.SaveChangesAsync();

                    Track creepAccoustic = new Track()
                    {
                        Title = "Creep Accoustic",
                        NormalizedTitle = "CREEP ACCOUSTIC",
                        PerformerUserName = "RadioHead",
                        GenreId = 1,
                        Duration = 255,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Path = "Creep Accoustic.mp3",
                        Image = "creepAccoustic.jpg",
                        PublicPerformerNickName = "Radiohead",
                        CountListened = 834573,
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = true,
                    };
                    await context.Tracks.AddAsync(creepAccoustic);
                    await context.SaveChangesAsync();

                    Track sayYes = new Track()
                    {
                        Title = "Say Yes To Heaven",
                        NormalizedTitle = "SAY YES TO HEAVEN",
                        PerformerUserName = "LanaDelRey",
                        GenreId = 1,
                        Duration = 198,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Path = "Say Yes To Heaven.mp3",
                        Image = "sayyes.jpg",
                        PublicPerformerNickName = "Lana Del Rey",
                        CountListened = 2423424,
                        IsDeleted = false,
                        IsExplicit = true,
                        IsPublic = true,
                    };
                    await context.Tracks.AddAsync(sayYes);
                    await context.SaveChangesAsync();

                    Track summer = new Track()
                    {
                        Title = "Summertime Sadness",
                        NormalizedTitle = "SUMMERTIME SADNESS",
                        PerformerUserName = "LanaDelRey",
                        GenreId = 1,
                        Duration = 265,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Path = "Summertime Sadness.mp3",
                        Image = "borntodie.jpg",
                        PublicPerformerNickName = "Lana Del Rey",
                        CountListened = 9845345,
                        IsDeleted = false,
                        IsExplicit = true,
                        IsPublic = true,
                    };
                    await context.Tracks.AddAsync(summer);
                    await context.SaveChangesAsync();

                    Track young = new Track()
                    {
                        Title = "Young And Beautiful",
                        NormalizedTitle = "YOUNG AND BEAUTIFUL",
                        PerformerUserName = "LanaDelRey",
                        GenreId = 1,
                        Duration = 233,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Path = "Young and Beatiful.mp3",
                        Image = "young.jpg",
                        PublicPerformerNickName = "Lana Del Rey",
                        CountListened = 14234537,
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = true,
                    };
                    await context.Tracks.AddAsync(young);
                    await context.SaveChangesAsync();

                    Track west = new Track()
                    {
                        Title = "West Coast",
                        NormalizedTitle = "WEST COAST",
                        PerformerUserName = "LanaDelRey",
                        GenreId = 1,
                        Duration = 252,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Path = "West Coast.mp3",
                        Image = "west.jpg",
                        PublicPerformerNickName = "Lana Del Rey",
                        CountListened = 243253433,
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = true,
                    };
                    await context.Tracks.AddAsync(west);
                    await context.SaveChangesAsync();

                    Track blue = new Track()
                    {
                        Title = "Blue Jeans",
                        NormalizedTitle = "BLUE JEANS",
                        PerformerUserName = "LanaDelRey",
                        GenreId = 1,
                        Duration = 222,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Path = "Blue Jeans.mp3",
                        Image = "blue.jpg",
                        PublicPerformerNickName = "Lana Del Rey",
                        CountListened = 647357,
                        IsDeleted = false,
                        IsExplicit = true,
                        IsPublic = true,
                    };
                    await context.Tracks.AddAsync(blue);
                    await context.SaveChangesAsync();
                }
                if (!context.Playlists.Any())
                {
                    Playlist playlist = new Playlist()
                    {
                        Title = "Пісні, що сподобались",
                        NormalizedTitle = "ПІСНІ, ЩО СПОДОБАЛИСЬ",
                        Description = " ",
                        Duration = 3600,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Image = "liked.jpg",
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = false,
                        UserName = "yana",
                    };
                    await context.Playlists.AddAsync(playlist);
                    await context.SaveChangesAsync();

                    Playlist playlist2 = new Playlist()
                    {
                        Title = "Пісні, що сподобались",
                        NormalizedTitle = "ПІСНІ, ЩО СПОДОБАЛИСЬ",
                        Description = " ",
                        Duration = 3600,
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        Image = "liked.jpg",
                        IsDeleted = false,
                        IsExplicit = false,
                        IsPublic = false,
                        UserName = "LanaDelRey",
                    };
                    await context.Playlists.AddAsync(playlist2);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
