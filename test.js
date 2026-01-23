// test-model.js
const userModel = require('./models/userModel');

async function test() {
    try {
        console.log('🧪 Test du modèle User...');
        
        // Test 1 : Calcul d'âge
        const age = userModel.calculerAge('1990-05-15');
        console.log('✅ Calcul d\'âge:', age);
        
        // Test 2 : Hash de mot de passe
        const hash = await userModel.hashPassword('monMot2Passe');
        console.log('✅ Hash généré:', hash.substring(0, 20) + '...');
        
        // Test 3 : Comparaison
        const match = await userModel.comparePassword('monMot2Passe', hash);
        console.log('✅ Comparaison mot de passe:', match);
        
        // Test 4 : Validation
        const userData = {
            nom: 'Jean',
            email: 'jean@mail.com',
            password: 'test123',
            date_naissance: '1990-05-15'
        };
        
        const validation = userModel.validateUser(userData);
        console.log('✅ Validation:', validation);

        // Test 5 : Validation avec erreurs
        const badUserData = {
            nom: 'J',  // Trop court
            email: 'pas-un-email', // Email invalide
            password: '123', // Trop court
            date_naissance: '2050-01-01' // Date future
        };
        
        const badValidation = userModel.validateUser(badUserData);
        console.log('✅ Validation avec erreurs:', badValidation);
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }

    
}

test();