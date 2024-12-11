# Passwort-Safe

Ein sicherer Passwort-Manager, der Passwörter verschlüsselt speichert und nur nach erfolgreicher Authentifizierung zugänglich macht.

## Features
- Speichern von Passwörtern (Benutzername, Passwort, URL)
- Verschlüsselung der Daten (AES oder RSA)
- Einfache Benutzeroberfläche mit React
- Sichere Anmeldung und Passwortverwaltung

## Architektur
- **Frontend**: React
- **Backend**: Spring Boot
- **Datenbank**: Wahlweise echte DB oder Mockup

## Sicherheitsaspekte
- Passwörter werden niemals im Klartext gespeichert.
- Verwendung von Salt und Pepper für zusätzliche Sicherheit.
- OWASP Top Ten Sicherheitsrichtlinien beachtet.

## Installation
1. Klonen Sie das Repository.
2. Installieren Sie die Abhängigkeiten für Frontend und Backend.
3. Starten Sie das Backend mit Spring Boot.
4. Starten Sie das Frontend mit React.

## Lizenz
MIT