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
Browser
   ↓
[Nginx Frontend Container]  (serves HTML/CSS/JS, proxies /php)
   ↓
[PHP/Apache Backend Container]  (PHP scripts, business logic)
   ↓
[MySQL Database Container]  (web24 schema)
🐳 Manual Docker Setup (Version 0.1)
Σε αυτή την έκδοση, η εφαρμογή τρέχει με χειροκίνητα Docker containers και ένα custom Docker network: disaster-net.

🔹 1. Δημιουργία Docker network
bash
Αντιγραφή κώδικα
docker network create disaster-net
🔹 2. MySQL Container
bash
Αντιγραφή κώδικα
docker run --name disaster-mysql ^
  -e MYSQL_ROOT_PASSWORD=<password> ^
  -e MYSQL_DATABASE=web24 ^
  --network disaster-net ^
  -p 3306:3306 ^
  -d mysql:8.0
🔹 3. Backend Container (PHP/Apache)
Build image:

bash
Αντιγραφή κώδικα
docker build -f Dockerfile.backend -t disaster-backend:1.2 .
Run container:

bash
Αντιγραφή κώδικα
docker run --name disaster-backend-test ^
  --network disaster-net ^
  -p 8081:80 ^
  -d disaster-backend:1.2
🔹 4. Frontend Container (Nginx)
Build image:

bash
Αντιγραφή κώδικα
docker build -f Dockerfile.frontend -t disaster-frontend:1.2 .
Run container:

bash
Αντιγραφή κώδικα
docker run --name disaster-frontend ^
  --network disaster-net ^
  -p 8080:80 ^
  -d disaster-frontend:1.2
🔗 Διασύνδεση Services
✔️ Frontend → Backend
Το Nginx του frontend χρησιμοποιεί proxy_pass για να στείλει αιτήματα προς το backend:

Hostname: disaster-backend-test

Port: 80 (στο εσωτερικό docker network)

✔️ Backend → MySQL
Ο backend συνδέεται στη MySQL χρησιμοποιώντας:

Hostname: disaster-mysql

Port: 3306

Database: web24