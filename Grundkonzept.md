# Grundkonzept: Passwort-Safe

## Projektbeschreibung
Das Ziel dieses Projekts ist die Entwicklung einer Web-Anwendung, die als Passwort-Safe dient. Die Anwendung ermöglicht es Nutzern, ihre Passwörter sicher zu speichern und bei Bedarf zu entschlüsseln. Dies erfolgt durch die Nutzung moderner Verschlüsselungstechniken und strikter Sicherheitsvorkehrungen.

## Architektur
Die Architektur des Projekts basiert auf einer 2-Schichten-Architektur, bestehend aus einem Frontend und einem Backend:

- **Frontend**: React
  - Ermöglicht eine benutzerfreundliche Oberfläche zur Interaktion mit der Anwendung.
  - Stellt Formulare für die Anmeldung, Passwortverwaltung und das Bearbeiten von gespeicherten Zugangsdaten bereit.
  
- **Backend**: Spring Boot
  - Verantwortlich für die Serverlogik und API-Endpoints.
  - Nutzt Java-Verschlüsselung (z.B. AES oder RSA) zur sicheren Speicherung und Verwaltung der Passwörter.
  - Authentifizierung und Autorisierung werden zentral im Backend abgewickelt.
  
- **Datenbank**: Wahl zwischen echter Datenbank oder Mockup
  - Daten wie URLs, Benutzernamen, Passwörter und Rubriken werden sicher gespeichert.
  - Der Zugriff auf die Datenbank erfolgt nur nach erfolgreicher Authentifizierung.

## Sicherheitsaspekte
Die Sicherheit hat höchste Priorität. Einige der wichtigsten Maßnahmen sind:

- **Verschlüsselung der Passwörter**: Die Passwörter werden nicht im Klartext gespeichert, sondern durch ein sicheres Verschlüsselungsverfahren (z.B. AES) geschützt.
- **Sicherheitsmethoden**: Es werden Methoden wie Salt und Pepper eingesetzt, um Passwörter vor Angriffen zu schützen.
- **Passwortgüte**: Die Anwendung überprüft, ob die Passwörter eine Mindestlänge und Komplexität aufweisen, um die Sicherheit zu erhöhen.
- **Zugangskontrolle**: Jeder Benutzer hat nur Zugriff auf seine eigenen gespeicherten Daten. Die Autorisierung erfolgt über ein sicheres Login-System.
- **OWASP Top Ten**: Die Anwendung wird gegen die gängigsten Sicherheitsrisiken (z.B. Broken Access Control, Injection, Cross-Site-Scripting) abgesichert.

## Funktionalität
- **Benutzeranmeldung**: Benutzer melden sich über ein Login-Formular an, um Zugriff auf ihre gespeicherten Passwörter zu erhalten.
- **Verwalten von Passwörtern**: Nutzer können neue Zugangsdaten hinzufügen, bestehende bearbeiten oder löschen.
- **Passwortverwaltung**: Die Anwendung ermöglicht es, Passwörter in verschiedene Kategorien (z.B. „Privates“, „Geschäft“) zu unterteilen.
- **Ändern des Master-Passworts**: Ein Benutzer kann sein Master-Passwort ändern, um den Zugriff auf seinen Passwort-Safe zu sichern.

## Verschlüsselungsverfahren
Für die Verschlüsselung der Passwörter wird ein **symmetrisches** Verfahren wie **AES** oder ein **asymmetrisches** Verfahren wie **RSA** verwendet. Beide Verfahren bieten starke Sicherheit und sind für den Einsatz in dieser Anwendung geeignet.

## Zeitplan
- **Projektstart (11.12.2024)**: Definition der Partner, Festlegung des Grundkonzepts, Erstellung des Git-Repositories.
- **Zwischenabgabe 1 (18.12.2024)**: Erste Version der Anwendung und erste Reflexion.
- **Zwischenabgabe 2 (08.01.2025)**: Weitere Entwicklung und Dokumentation.
- **Endabgabe (15.01.2025)**: Fertigstellung des Projekts.

## Weiteres Vorgehen
In den kommenden Wochen wird die Benutzeroberfläche (Frontend) entwickelt und die Funktionalität im Backend implementiert. Eine gründliche Testphase zur Überprüfung der Sicherheit und Funktionalität wird durchgeführt.
