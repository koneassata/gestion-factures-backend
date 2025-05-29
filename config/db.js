const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Vérifier si la variable d'environnement MONGODB_URI est définie
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error("❌ Erreur de configuration : La variable d'environnement MONGODB_URI n'est pas définie. Assurez-vous de l'avoir configurée sur Render.");
      // Il est crucial de quitter le processus si la variable la plus importante est manquante
      process.exit(1);
    }

    // Tenter la connexion à MongoDB
    const conn = await mongoose.connect(mongoURI, {
      // Ces options (useNewUrlParser, useUnifiedTopology) sont obsolètes avec Mongoose 6+ et peuvent être supprimées.
      // Si votre version de Mongoose est inférieure à 6, vous pourriez en avoir besoin.
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    // Message de succès si la connexion est établie
    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
  } catch (err) {
    // C'est LA LIGNE CLÉ : Afficher le message d'erreur détaillé de Mongoose
    console.error(`❌ Erreur de connexion MongoDB : ${err.message}`);
    // Quitter le processus pour signaler à Render que le service a échoué
    process.exit(1);
  }
};

module.exports = connectDB;