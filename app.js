// Ejemplo 4: implementa acciones de la app.

var prompt = require('prompt-sync')();
var ConversationV1 = require('watson-developer-cloud/conversation/v1');

// Configurar el derivador del servicio Conversation.
var conversation = new ConversationV1({
  username: 'd3d5761d-daab-4a1b-9086-760faeeb37b5', // sustituir por nombre de usuario de la clave de servicio
  password: 'CBWlbqX8lLDV', // sustituir por contraseña de la clave de servicio
  path: { workspace_id: '12d024e5-ed9f-4591-8414-fb05897bb194' }, // sustituir por ID de espacio de trabajo
  version_date: '2016-07-11'
});

// Iniciar conversación con mensaje vacío.
conversation.message({}, processResponse);

// Procesar la respuesta de la conversación.
function processResponse(err, response) {
  if (err) {
    console.error(err); // algo ha fallado
    return;
  }

  var endConversation = false;

  if(response.output.action!=null){
    console.log(`La acción en cuestion es: ${response.output.action}`);
  }

  // Comprobar los distintivos de la acción.
  if (response.output.action === 'mostrar_hora') {
    // El usuario ha preguntado qué hora es, así que devolvemos como salida la hora del sistema local.
    console.log(`Son las ${new Date().toLocaleTimeString()}`);
  } else if (response.output.action === 'fin_conversacion') {
    // El usuario se ha despedido, así que hemos terminado.
    console.log(response.output.text[0]);
    endConversation = true;
  } else {
    // Mostrar la salida del diálogo, si la hay.
    if (response.output.text.length != 0) {
        console.log(response.output.text[0]);
    }
  }

  // Si no hemos terminado, solicitar la siguiente ronda de información de entrada.
  if (!endConversation) {
    var newMessageFromUser = prompt('>> ');
    conversation.message({
      input: { text: newMessageFromUser },
      // Enviar el contexto para mantener el estado.
      context : response.context,
    }, processResponse)
  }
}
