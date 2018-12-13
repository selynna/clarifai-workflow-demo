var clarifaiApiKey = 'YOUR_API_KEY';
var workflowId = 'YOUR_WORKFLOW_ID';

var app = new Clarifai.App({
  apiKey: clarifaiApiKey
});

function uploadImage() {
	var preview = document.querySelector('img');
  var file = document.querySelector('input[type=file]').files[0];
  var reader = new FileReader();

  reader.addEventListener("load", function () {
    preview.src = reader.result;
    var imageData = reader.result;
    imageData = imageData.replace(/^data:image\/(.*);base64,/, '');
    predictFromWorkflow(imageData);
  }, false);

  if (file) {
    reader.readAsDataURL(file);
    preview.style.display = "inherit";
  }
}

function getModelName(output) {
  if (output.model.display_name !== undefined) {
    return output.model.display_name;
  } else if (output.model.name !== undefined) {
    return output.model.name;
  } else {
    return "";
  }
}

function getFormattedString(output) {
  var formattedString = "";
  var data = output.data;
  var maxItems = 3;
  // General
  if (output.model.model_version.id === "aa9ca48295b37401f8af92ad1af0d91d") {
    var items = data.concepts;
    if (items.length < maxItems) {
      maxItems = items.length;
      if (maxItems === 1) {
        formattedString = "The " + maxItems + " thing we are most confident in detecting are:<br/>";
      }
    } else {
      formattedString = "The " + maxItems + " things we are most confident in detecting are:<br/>";
    }

    for (var i = 0; i < maxItems; i++) {
      formattedString += "- " + items[i].name + " at a " + (Math.round(items[i].value * 10000) / 100) + "% probability<br/>";
    }
  } 
  // Apparel 
  else if (output.model.model_version.id === "dc2cd6d9bff5425a80bfe0c4105583c1") {
    var items = data.concepts;
    if (items.length < maxItems) {
      maxItems = items.length;
      if (maxItems === 1) {
        formattedString = "The " + maxItems + " piece of apparel we are most confident in detecting are:<br/>";
      }
    } else {
      formattedString = "The " + maxItems + " pieces of apparel we are most confident in detecting are:<br/>";
    }

    for (var i = 0; i < maxItems; i++) {
      formattedString += "- " + items[i].name + " at a " + (Math.round(items[i].value * 10000) / 100) + "% probability<br/>";
    }

  }
  // Celebrity
  else if (output.model.model_version.id === "bdb0537982ae4e0da563ed836ccfa065") {
    var items = data.regions;
    if (data.regions.length === 1) {
      formattedString = "The person in this picture we are confident in detecting is:<br/>";
    } else {
      formattedString = "The people in this picture we are confident in detecting are:<br/>";
    }

    for (var i = 0; i < items.length; i++) {
      var item = items[i].data.face.identity.concepts[0];
      formattedString += "- " + item.name + " at a " + (Math.round(item.value * 10000) / 100) + "% probability<br/>";
    }
  }
  // Color
  else if (output.model.model_version.id === "dd9458324b4b45c2be1a7ba84d27cd04") {

  }
  // Demographics
  else if (output.model.model_version.id === "f783f0807c52474c8c6ad20c8cf45fc0") {
    var items = data.regions;
    formattedString = "The demographics we are confident in detecting are:<br/>";

    for (var i = 0; i < items.length; i++) {
      var item = items[i].data.face;
      formattedString += "- " + item.multicultural_appearance.concepts[0].name + ", " 
        + item.gender_appearance.concepts[0].name + ", " 
        + item.age_appearance.concepts[0].name + " year old";
    }
  }
  // Face Detection
  else if (output.model.model_version.id === "c67b5872d8b44df4be55f2b3de3ebcbb") {

  }
  // Face Embedding
  else if (output.model.model_version.id === "ec1740642c83478392e7b8735c43c630") {

  }
  // Focus
  else if (output.model.model_version.id === "fefeafd0c9224bce9274f06dad43553e") {

  }
  // Food
  else if (output.model.model_version.id === "dfebc169854e429086aceb8368662641") {
    var items = data.concepts;
    if (items.length < maxItems) {
      maxItems = items.length;
      if (maxItems === 1) {
        formattedString = "The " + maxItems + " food item we are most confident in detecting are:<br/>";
      }
    } else {
      formattedString = "The " + maxItems + " food items we are most confident in detecting are:<br/>";
    }

    for (var i = 0; i < maxItems; i++) {
      formattedString += "- " + items[i].name + " at a " + (Math.round(items[i].value * 10000) / 100) + "% probability<br/>";
    }

  }
  // General Embedding
  else if (output.model.model_version.id === "bb7ac05c86be42d38b67bc473d333e07") {

  }
  // Landscape Quality
  else if (output.model.model_version.id === "a008c85bb6d44448ad35470bcd22666c") {

  }
  // Logo
  else if (output.model.model_version.id === "ef1b7237d28b415f910ca343a9145e99") {

  }
  // Moderation
  else if (output.model.model_version.id === "aa8be956dbaa4b7a858826a84253cab9") {

  }
  // NSFW
  else if (output.model.model_version.id === "aa47919c9a8d4d94bfa283121281bcc4") {

  }
  // Portrait Quality
  else if (output.model.model_version.id === "c2e2952acb80429c8abb53e2fe3e11cd") {

  }
  // Textures & Patterns
  else if (output.model.model_version.id === "b38274b04b1b4fb28c1b442dbfafd1ef") {

  }
  // Travel
  else if (output.model.model_version.id === "d2ffbf9730fd41fea79063270847be82") {

  }
  // Wedding
  else if (output.model.model_version.id === "b91bcf877c464a38a25a742694da7535") {

  }

  return formattedString;

}

function predictFromWorkflow(photoUrl) {
  app.workflow.predict(workflowId, {base64: photoUrl}).then(
      function(response){
        var outputs = response.results[0].outputs;
        var analysis = $(".analysis");

        outputs.forEach(function(output) {
          var modelName = getModelName(output);
          console.log("Model name: " + modelName);

          console.log(output);
          console.log(output.data);

          // Create heading for each section
          var newModelSection = document.createElement("div");
          newModelSection.className = modelName;

          var newModelHeader = document.createElement("h2");
          newModelHeader.innerHTML = modelName;
          newModelHeader.className = "model-header";

          var formattedString = getFormattedString(output);
          var newModelText = document.createElement("p");
          newModelText.innerHTML = formattedString;
          newModelText.className = "model-text";

          newModelSection.append(newModelHeader);
          newModelSection.append(newModelText);
          analysis.append(newModelSection);
        });
      },
      function(err){
        console.log(err);
      }
  );
}
