# DisasterConnect – 3-Tier Containerized Web Application

Το **DisasterConnect** είναι μια 3-tier web εφαρμογή για διαχείριση πόρων, αιτημάτων και λογαριασμών σε περιβάλλον καταστροφών.

Η εφαρμογή αποτελείται από:

- **Frontend**: Static HTML/CSS/JS σε Nginx  
- **Backend**: PHP 8.2 + Apache  
- **Database**: MySQL 8.0  
- **Reverse Proxy**: Nginx που δρομολογεί αιτήματα προς το backend  

Αυτή τη στιγμή το project τρέχει σε **3 Docker containers**, συνδεδεμένα μέσω ενός custom Docker network.

---

## 🧱 Αρχιτεκτονική (Version 1.0 – Manual Docker)

```text
Σε αυτή την έκδοση, η εφαρμογή τρέχει με χειροκίνητα Docker containers και ένα custom Docker network: disaster-net.

🔹 1. Δημιουργία Docker network
docker network create disaster-net

🔹 2. MySQL Container
docker run --name disaster-mysql ^
  -e MYSQL_ROOT_PASSWORD=<password> ^
  -e MYSQL_DATABASE=web24 ^
  --network disaster-net ^
  -p 3306:3306 ^
  -d mysql:8.0

🔹 3. Backend Container (PHP/Apache)
Build image:
docker build -f Dockerfile.backend -t disaster-backend:1.2 .

Run container:
docker run --name disaster-backend-test ^
  --network disaster-net ^
  -p 8081:80 ^
  -d disaster-backend:1.2

🔹 4. Frontend Container (Nginx)
Build image:
docker build -f Dockerfile.frontend -t disaster-frontend:1.2 .

Run container:
docker run --name disaster-frontend ^
  --network disaster-net ^
  -p 8080:80 ^
  -d disaster-frontend:1.2

-----------------------------------------------------------------------------------------------------------
🧩 Version 1.2 – Orchestration με Docker Compose

Στην έκδοση 1.2, το ίδιο 3-tier σύστημα ορχηστρώνεται μέσω Docker Compose, ώστε όλα τα services να σηκώνονται με μία εντολή.
🔹 docker-compose.yml 

Το project περιλαμβάνει αρχείο docker-compose.yml με 3 services:
    disaster-mysql – MySQL 8.0 με persistent volume
    disaster-backend-test – PHP/Apache backend (build από dockerfile.backend)
    disaster-frontend – Nginx frontend (build από dockerfile.frontend)

🔹 Εκκίνηση με Compose
docker compose up -d

Άρα σε αυτό το version, με 1 μόνο εντολή:
1) Χτίζει τα images για backend & frontend
2)Κατεβάζει το mysql:8.0 image
3)Δημιουργεί a)το Docker network disaster-net 
             b)το volume db_data

4)Σηκώνει ΟΛΑ τα containers στο background

🔹 Σβήσιμο/σταμάτημα με Compose
docker compose down
Σταματάει και σβήνει τα containers.
Το volume db_data παραμένει (κρατάει τη βάση δεδομένων)

🚀 Version Roadmap (Junior DevOps Journey)
Versions used until now:
1.0	Πλήρως Dockerized 3-tier app με manual docker run & custom network
1.2	Orchestration με Docker Compose (docker-compose.yml, networks, volumes, depends_on)