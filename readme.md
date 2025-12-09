## DisasterConnect – 3-Tier Containerized Web Application (DevOps Portfolio Project)

Το **DisasterConnect** είναι μια 3-tier web εφαρμογή για διαχείριση πόρων, αιτημάτων και λογαριασμών σε περιβάλλον καταστροφών. 
Η εφαρμογή αποτελείται από:
- **Frontend**: Static HTML/CSS/JS σε Nginx
- **Backend**: PHP 8.2 + Apache 
- **Database**: MySQL 8.0 
- **Reverse Proxy**: Nginx που δρομολογεί αιτήματα προς το backend. 

Αυτή τη στιγμή το project τρέχει σε **Kubernetes Cluster**, έχοντας περάσει από τα στάδια Docker και Docker Compose.  
To project αυτό έχει δημιουργηθεί καθαρά για ακαδημαικούς σκοπούς.  
Για κάθε Version, υπάρχει και το αντίστοιχο tag στο repository με τα files του.

## (Version 1.1 – Manual Docker)

```text
Σε αυτή την έκδοση, η εφαρμογή τρέχει με χειροκίνητα Docker containers.
⚠️ Security Note: Οι κωδικοί περνούσαν ως plain-text (ειναι visible στα αρχεία).

🔹 Αρχιτεκτονική:
3 ξεχωριστά Containers που επικοινωνούν μέσω του 'disaster-net'.

🚀 How to Run (Commands):
# 1. Network
docker network create disaster-net

# 2. Database (Password visible! - Kathe arxi kai duskolh)
docker run --name disaster-mysql -e MYSQL_ROOT_PASSWORD=Omgkai3lol! -e MYSQL_DATABASE=web24 --network disaster-net -p 3306:3306 -d mysql:8.0

# 3. Backend (Build & Run)
docker build -f Dockerfile.backend -t disaster-backend:1.1 .
docker run --name disaster-backend-test --network disaster-net -p 8081:80 -d disaster-backend:1.1

# 4. Frontend (Build & Run)
docker build -f Dockerfile.frontend -t disaster-frontend:1.1 .
docker run --name disaster-frontend --network disaster-net -p 8080:80 -d disaster-frontend:1.1

🧪 Test Case:
1. Ανοίξτε τον browser στο http://localhost:8080.
2. Η αρχική σελίδα φορτώνει από το Frontend container.
```

---

## (Version 1.2 – Docker Compose)
```text
🔹 docker-compose.yml:
Περιλαμβάνει τα 3 services.
Notes: 1)Ο κωδικός ήταν γραμμένος μέσα στο αρχείο yml.
       2)Stateless (Στο 'docker compose down' τα δεδομένα χάνονται).

🚀 How to Run (Commands):
# Εκκίνηση όλων
docker compose up -d --build

# Τερματισμός (Data Loss triggers here)
docker compose down

🧪 Test Case:
1. Τρέξτε 'docker compose up -d'.
2. Μπείτε στο site και κάντε εγγραφή.
3. Τρέξτε 'docker compose down' και μετά ξανά 'up'.
4. Ο χρήστης έχει χαθεί (Expected behavior for stateless).
```
---

## (Version 2.0 – Kubernetes / Minikube)

```text
Σε αυτή την έκδοση, το project μεταβαίνει σε Kubernetes (Minikube).
Η εφαρμογή τρέχει ως Pods (Deployments & Services).

Βασικές Αλλαγές:
- Kubernetes Manifests (.yaml).
- Data Injection μέσω ConfigMap (web24.sql).
- Namespace isolation.
⚠️ Security Note: Στο 'mysql.yaml' ο κωδικός ήταν ακόμα visible στο πεδίο 'env'.

🚀 How to Run (Commands):
# 1. Start & Config
minikube start
kubectl apply -f k8s/00-namespace.yaml
kubectl create configmap mysql-initdb-config --from-file=web24.sql -n disasterconnect

# 2. Deploy Services
kubectl apply -f k8s/mysql.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml

(Συνοπτικά μπορούσαμε και kubectl apply -f k8s/)

# 3. Access (Minikube Tunnel)
minikube service disaster-frontend -n disasterconnect

🧪 Test Case:
1. Τρέξτε 'kubectl get pods -n disasterconnect'. Πρέπει να δείτε 3/3 Running.
2. Πατήστε το URL που δίνει η εντολή minikube service, αν δεν σας εχει ήδη ανοίξει ο browser.
3. Ανοίξτε δεύτερο παράθυρο στο CMD γιατί στο πρώτο δεν είναι διαθέσιμο το CMD γιατι σηκώνει το site.
4. Διαγράψτε ένα pod (π.χ. frontend) και δείτε το Kubernetes να το ξαναφτιάχνει αυτόματα (Self-healing).
```

---

## (Version 2.1 – CI/CD Automation with GitHub Actions)

```text
Σε αυτή την έκδοση, προστέθηκε πλήρης αυτοματισμός (CI/CD Pipeline).
Πολύ βασικό στάδιο CI/CD (Έλεγχος λειτουργίας κώδικα-->build-->push image sto dockerhub μου)
Δεν χρειάζεται χειροκίνητο build ή push των Docker images.

🔹 Η Ροή του Pipeline:
Push στο 'master' -> GitHub Runner -> Login DockerHub -> Build Images -> Push Images.

📂 Αρχείο Ρύθμισης: .github/workflows/docker-publish.yml

🚀 How to Trigger:
# Απλά κάντε μια αλλαγή στον κώδικα και στείλτε την
git add .
git commit -m "Update code"
git push origin master

🧪 Verification Test:
1. Πηγαίνετε στο tab "Actions" στο GitHub repository.
2. Παρατηρήστε το Workflow να τρέχει και να γίνεται Πράσινο (Success).
3. Ελέγξτε το DockerHub: Τα tags 'latest' πρέπει να έχουν ενημερωθεί "a few seconds ago".
```

---

## (Version 2.2 – Data Persistence with PVC)

```text
Σε αυτή την έκδοση, λύθηκε το πρόβλημα της απώλειας δεδομένων. Η εφαρμογή είναι πλέον Stateful.

🔹 Η Λύση:
Χρήση PersistentVolumeClaim (PVC) ώστε η βάση δεδομένων να γράφει σε μόνιμο δίσκο του Cluster και όχι στο Container.

📂 Νέα Αρχεία: k8s/mysql-pvc.yaml

🚀 How to Run (Commands):
# 1. Δημιουργία του "Δίσκου"
kubectl apply -f k8s/mysql-pvc.yaml

# 2. Ενημέρωση της MySQL 
kubectl apply -f k8s/mysql.yaml

🧪 Persistence Test Case:
1. Κάντε Sign Up έναν νέο χρήστη στην εφαρμογή.
2. Διαγράψτε το Pod της MySQL:
   kubectl delete pod -l app=disaster-mysql -n disasterconnect
3. Περιμένετε να ξανα-δημιουργηθεί το Pod.
4. Κάντε Refresh. Ο χρήστης πρέπει να ΥΠΑΡΧΕΙ κανονικά.
```

---

## (Version 2.3 – Full Security: Secrets & Env Variables)

```text
Σε αυτή την έκδοση, θωρακίσαμε την ασφάλεια αφαιρώντας όλους τους plain-text κωδικούς από YAML και PHP αρχεία.

🔹 Η Λύση:
- Kubernetes Secrets για κρυπτογραφημένη αποθήκευση.
- Environment Variable Injection στα Pods.
- PHP `getenv()` για ασφαλή ανάγνωση κωδικών.

🚀 How to Run (Commands):
# 1. Δημιουργία Secret (ΜΟΝΟ μια φορά, χειροκίνητα)
kubectl create secret generic mysql-secret --from-literal=password='Omgkai3lol!' -n disasterconnect

# 2. Εφαρμογή των ασφαλών Deployments
kubectl apply -f k8s/mysql.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml

🧪 Security Test Case:
1. Προσπαθήστε να κάνετε Login.
2. Αν πετύχει, σημαίνει ότι:
   - Το K8s ξεκλείδωσε το Secret.
   - Το έδωσε στο Backend.
   - Η PHP το διάβασε σωστά και συνδέθηκε στη βάση.
```