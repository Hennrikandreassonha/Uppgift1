Denna applikationen går att köras med en databas eller utan. Kör du utan kommer dina notes inte sparas när du stänger ned.
För att köra med databas så får man för initialisera den. 
Gör detta genom att skriva "dotnet ef database update" i konsollen. Du tar upp konsollen med CTRL+Ö eller i menyn högst upp.
Du borde nu se databasen i tex Microsoft SQL server management studio eller liknande program.
Connectionstring går att se i Appsettings.json om det skulle strula.

Starta sedan backenden med F5 eller gröna knappen.
Starta frontent med tex LiveServer

Registrera dig i "auth rutan". Logga sedan in med samma uppgifter.
Du kan nu lägga till, ändra och ta bort dina noteringar i databasen.
