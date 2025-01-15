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
Wir nehmen uns vor die Passwörter nicht im Klartext zu speichern, sodass keine Cryptographic Failures entstehen. Wir werden die Passwörter also erst nach dem Durchlaufen eins sicheren Hashing-Algorithmus speichern. Um weitere Sicherheit vor Broken Authentication zu gewähren wollen wir die Passwörter zusätzlich mit Salt und Pepper abspeichern. Somit schützen wir uns vor Angriffen mit Rainbow-Tables. Indem wir den API-Call filtern, können wir Broken Access Control vorbiegen. Somit können unberechtigte Nutzer nicht auf die Daten Anderer oder die Liste der Accounts zugreifen. Mit AntiSamy können wir die Eingabefelder validieren bzw. die Eingabe bereinigen. Dadurch kann keine Injection mehr gemacht werden, welche vor Allem die Daten, also die gespeicherten Passwörter, sichert. Auch Server-Side Request Forgery kann dadurch abgefagen werden. Was Insecure Design angeht, haben wir uns gedacht, dass das Refreshen der Seite ein erneutes Login benötigt, somit gehen wir sicher, dass der richtige Nutzer Zugriff auf seine Daten bekommt. Den Punkt Security Misconfiguration wirkt erst sehr simpel. Man sollte keine Standardpasswörter und keine veraltete Software verwenden. Als Schüler finden wir es schwierig der Software, welche wir für die Sicherheit verwenden, zu trauen, da wir uns noch zu wenig auskennen müssen wir uns auf Quellen, wie dem Internet, ChatGPT oder unserem Lehrer, verlassen. Der Punkt mit den Standardpasswörtern ist einfach umzusetzen, jedoch für das Testen der Applikation nicht vorteilhaft. Wir müssen deshalb daran denken nach dem Testen sichere Passwörter festzulegen. Vulnerable and Outdated Components können wir wie gesagt nur bedingt prüfen. Wir achten auf die Version und schauen im Internet nach, ob es Rückmeldungen gibt, welche auf eine Sicherheitslücke hindeuten, um auch Software and Data Integrity Failures zu vermeiden. Wie schon erwähnt speichern wir keine Cookies, um Identification and Authentication Failures zu vermeiden. Was den Punkt Security Logging and Monitoring Failures angeht haben wir verschiedene Error-Nachrichten verfasst und an stellen eingebaut, welche bei öfterem Auslösen verdächtig wirken. Wenn die Applikation auf einem Server laufen würde könnte man diese einsehen.
Da es sich um einen persöhnlichen Passwort Manager handelt gibt es einen Account. Die Login-Daten sind **Nutzername: user1 und Passwort: test**. Selbstverständlich ist dieses Login sehr unsicher und nur im Rahmen dieses Schulprojekts zu verwenden. Das Passwort ist zu kurz, ohne Zahlen und ohne Sonderzeichen ist. Ausserdem ist das Passwort ein echtes Wort, welches im Kontext der Entwicklung oft als Passwort verwendet wird.

## Installation

incoming
