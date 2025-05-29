exports.handler = async function(event, context) {
  console.log('Function invoked with event:', {
    httpMethod: event.httpMethod,
    path: event.path,
    headers: event.headers,
    body: event.body
  });

  // Vérifier que c'est une requête POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Log des données reçues
    console.log('Données reçues:', data);
    
    // Validate required fields
    const { name, email, phone, date, time, service, message = '' } = data;
    console.log('Champs extraits:', { name, email, phone, date, time, service });
    
    if (!name || !email || !phone || !date || !time || !service) {
      console.log('Champs manquants:', {
        name: !name,
        email: !email,
        phone: !phone,
        date: !date,
        time: !time,
        service: !service
      });
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Veuillez remplir tous les champs obligatoires' })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Format d\'email invalide' })
      };
    }

    // Validate phone format - accept numbers with optional +, spaces, or dashes
    const phoneRegex = /^[+]?[0-9\s-]{8,}$/;
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!phoneRegex.test(phone) || cleanPhone.length < 8 || cleanPhone.length > 15) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Format de numéro de téléphone invalide' })
      };
    }

    // Format appointment data
    const appointmentData = {
      name,
      email,
      phone,
      date,
      time,
      service,
      message,
      createdAt: new Date().toISOString()
    };

    // Préparer les données pour n8n
    const n8nData = [{
      ...appointmentData,
      type: 'appointment',
      source: 'website',
      status: 'pending',
      created_at: new Date().toISOString()
    }];

    try {
      // Envoyer les données à n8n
      console.log('Envoi des données à n8n:', n8nData);
      
      const n8nResponse = await fetch('https://n8n.fido.ma/n8n/webhook/appointment-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(n8nData)
      });

      const n8nResult = await n8nResponse.text();
      console.log('Réponse n8n:', n8nResult);

      if (!n8nResponse.ok) {
        console.error('Erreur n8n:', n8nResult);
        throw new Error('Erreur lors de l\'envoi à n8n');
      }

      console.log('Rendez-vous envoyé à n8n avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi à n8n:', error);
      // On continue quand même pour ne pas bloquer l'utilisateur
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Votre rendez-vous a été programmé avec succès',
        data: appointmentData
      })
    };
  } catch (error) {
    console.error('Error processing appointment:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Une erreur est survenue lors de la programmation du rendez-vous' })
    };
  }
}
