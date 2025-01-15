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
- **Datenbank**: Json File

## Sicherheitsaspekte
Wir nehmen uns vor die Passwörter nicht im Klartext zu speichern, sodass keine Cryptographic Failures entstehen. Wir werden die Passwörter also erst nach dem Durchlaufen eins sicheren Hashing-Algorithmus speichern. Um weitere Sicherheit vor Broken Authentication zu gewähren wollen wir die Passwörter zusätzlich mit Salt und Pepper abspeichern. Somit schützen wir uns vor Angriffen mit Rainbow-Tables. Indem wir den API-Call filtern, können wir Broken Access Control vorbiegen. Somit können unberechtigte Nutzer nicht auf die Daten Anderer oder die Liste der Accounts zugreifen. Mit AntiSamy können wir die Eingabefelder validieren bzw. die Eingabe bereinigen. Dadurch kann keine Injection mehr gemacht werden, welche vor Allem die Daten, also die gespeicherten Passwörter, sichert. Was Insecure Design angeht, haben wir uns gedacht, dass das Refreshen der Seite ein erneutes Login benötigt, somit gehen wir sicher, dass der richtige Nutzer Zugriff auf seine Daten bekommt. Den Punkt Security Misconfiguration wirkt erst sehr simpel. Man sollte keine Standardpasswörter und keine veraltete Software verwenden. Als Schüler finden wir es schwierig der Software, welche wir für die Sicherheit verwenden, zu trauen, da wir uns noch zu wenig auskennen müssen wir uns auf Quellen, wie dem Internet, ChatGPT oder unserem Lehrer, verlassen. Der Punkt mit den Standardpasswörtern ist einfach umzusetzen, jedoch für das Testen der Applikation nicht vorteilhaft. Wir müssen deshalb daran denken nach dem Testen sichere Passwörter festzulegen.

## Installation

incoming
