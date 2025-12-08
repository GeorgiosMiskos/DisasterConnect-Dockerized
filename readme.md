## DisasterConnect – 3-Tier Containerized Web Application (Trying to dockerize project for portfolio)
Το **DisasterConnect** είναι μια 3-tier web εφαρμογή για διαχείριση πόρων, αιτημάτων και λογαριασμών σε περιβάλλον καταστροφών. 
Η εφαρμογή αποτελείται από:
 - **Frontend**: Static HTML/CSS/JS σε Nginx
 - **Backend**: PHP 8.2 + Apache 
 - **Database**: MySQL 8.0 
 - **Reverse Proxy**: Nginx που δρομολογεί αιτήματα προς το backend. 
Αυτή τη στιγμή το project τρέχει σε **3 Docker containers**, συνδεδεμένα μέσω ενός custom Docker network.

 ---

## (Version 1.1 – Manual Docker)

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
```

---

## (Version 1.2 – Docker Compose)

```text
Σε αυτή την έκδοση, το ίδιο 3-tier σύστημα ορχηστρώνεται μέσω Docker Compose, ώστε όλα τα services να σηκώνονται με μία εντολή.

🔹 docker-compose.yml
Το project περιλαμβάνει αρχείο docker-compose.yml με 3 services:
    disaster-mysql – MySQL 8.0 με persistent volume
    disaster-backend-test – PHP/Apache backend (build από Dockerfile.backend)
    disaster-frontend – Nginx frontend (build από Dockerfile.frontend)

🔹 Εκκίνηση με Compose
docker compose up -d

Με 1 εντολή:
1) Χτίζει τα images για backend & frontend
2) Κατεβάζει το mysql:8.0 image
3) Δημιουργεί:
      a) το Docker network disaster-net
      b) το volume db_data
4) Σηκώνει ΟΛΑ τα containers στο background

🔹 Σβήσιμο/σταμάτημα με Compose
docker compose down
Σταματάει και σβήνει τα containers.
Το volume db_data παραμένει (κρατάει τη βάση δεδομένων)
```

---

## (Version 2.0 – Kubernetes / Minikube)

```text
Σε αυτή την έκδοση, το project μεταβαίνει από το Docker Compose σε περιβάλλον Orchestration με Kubernetes (Minikube).
Η εφαρμογή δεν τρέχει πλέον ως απλά containers, αλλά ως Pods διαχειριζόμενα από Deployments και Services, προσομοιώνοντας ένα production περιβάλλον.

Βασικές Αλλαγές:
- Χρήση Kubernetes Manifests (.yaml) αντί για docker-compose.
- Data Injection στη MySQL μέσω ConfigMap (το αρχείο web24.sql ανεβαίνει στο Cluster).
- Self-healing: Το Kubernetes επανεκκινεί αυτόματα τα Pods αν κρασάρουν.
- Namespace isolation: Όλα τρέχουν στο namespace 'disasterconnect'.

🔹 1. Προετοιμασία Cluster & Namespace
minikube start
kubectl apply -f k8s/00-namespace.yaml

🔹 2. Φόρτωση Βάσης (ConfigMap)
Επειδή το Minikube δεν βλέπει τους τοπικούς φακέλους όπως το Docker Compose, ανεβάζουμε το SQL script ως ConfigMap:

kubectl create configmap mysql-initdb-config --from-file=web24.sql -n disasterconnect

🔹 3. Εκκίνηση Services (Deployments)
Σηκώνουμε τα Deployments για MySQL, Backend και Frontend:

kubectl apply -f k8s/mysql.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml

🔹 4. Πρόσβαση στην εφαρμογή
Επειδή τρέχουμε σε Cluster, ζητάμε από το Minikube να μας δώσει το URL για το Frontend service:

minikube service disaster-frontend -n disasterconnect

🔹 5. Έλεγχος κατάστασης
Για να δούμε αν όλα τα Pods τρέχουν (Running 1/1):

kubectl get pods -n disasterconnect -w

---

## (Version 2.1 – CI/CD Automation)

```text
Σε αυτή την έκδοση, προστέθηκε αυτοματισμός (CI/CD) χρησιμοποιώντας GitHub Actions.
Πλέον, δεν χρειάζεται χειροκίνητο build των Docker images.

🔹 Πώς λειτουργεί το Pipeline:
1. Κάθε φορά που γίνεται Push κώδικα στο 'master' branch.
2. Το GitHub δεσμεύει έναν Ubuntu server.
3. Κατεβάζει τον κώδικα (Checkout).
4. Συνδέεται στο DockerHub (Login) χρησιμοποιώντας κρυπτογραφημένα Secrets.
5. Χτίζει τα Docker Images για Frontend & Backend.
6. Τα ανεβάζει αυτόματα (Push) στο DockerHub repositories.

🔹 Αρχείο Ρύθμισης: .github/workflows/docker-publish.yml