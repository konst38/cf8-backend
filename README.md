# cf8-backend
Η εφαρμογη εχει σχεδιαστει για επικοινωνια με βαση δεδομενων mongodb.
Για να τρεξει η εφαρμογη πρεπει ο χρηστης αφου την κατεβασει με git clone να δημιουργησει ενα αρχειο τυπου text με ονομα .env το οποιο περιεχει τις μεταβλητες: 

MONGO_URI = "το connection string με την mongodb βαση δεδομενων"
PORT = ο αριθμος του port στο οποιο θελει να τρεχει η εφαρμογη, π.χ. 3000
JWT_SECRET = "ενα jwt secret key απο καποιον jwt secret key generator"

Το αρχειο .env πρεπει να μπει στον φακελο οπου κατεβηκε η εφαρμογη, π.χ. /cf8-backend.
Στη συνεχεια ο χρηστης πρεπει να τρεξει την εντολη npm install μεσα απο ενα command prompt terminal για να εγκτασταθουν τα dependencies. 
Η εφαρμογη τρεχει με την εντολη npm run dev και παλι σε ενα command prompt.
Η εφαρμογη γινεται build με την εντολη npm run build.
Τα tests τρεχουν με την εντολη npm run test. 
Το swagger χρησιμοποιει το endpoint /api/docs. 