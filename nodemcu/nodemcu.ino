#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include "DHTesp.h"

// setting device key
String key = "q6HfstdSWq";
// setting sensors and modules pins.
int dhtPin = 16;      // D0 pin
int motion = 5;       // D1 pin
int gasPin = A0;      // A0 pin
int relayPin = 4;     // D2 pin
int buzzerPin = 0;

// setting default thresholds.
int tmpThresh = 200;
int hmdThresh = 200;
int metThresh = 200;
int motThresh = 200;

// setting timer variables.
int timer = 0;
int timeInt = 1000 * 60 * 5;

// if detect any motion in 5 mins. time interval then send true.
int motToSend = 0;
int metToSend = 0;

// initialize dht11
DHTesp dht;

void setup() {

  // setting modules as INPUT and OUTPUTS.
  pinMode(motion, INPUT);
  pinMode(relayPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);

  // connecting to wifi.
  Serial.begin(115200);
  WiFi.begin("SSID", "PASSWORD");

  // while connecting print "Waiting for connection".
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
    delay(500);
    Serial.println("Waiting for connection");
  }

  // set relay as LOW (Close relay).
  digitalWrite(relayPin, LOW);
  
  // setting up dht pin.
  dht.setup(dhtPin, DHTesp::DHT11); 
 
}
 
void loop() {

  // read datas from sensors.
  int motionData = digitalRead(motion);
  float humidity = dht.getHumidity();
  float temperature = dht.getTemperature();
  float methane = analogRead(gasPin) / 10.24;

  // wait for 20 ms.
  delay(20);

  // alarm conditions.
  if (motionData == 1){
    Serial.println("Motion Detected !");
    motToSend = 1;  
  }

  if (methane >= (int)metToSend){
    metToSend = methane;  
  }
  
  if (tmpThresh <= (int)temperature){
    Serial.println("\nTemperature Alarm !!!");
    startAlarm();  
  }

  if (hmdThresh <= (int)humidity){
    Serial.println("\nHumidity Alarm !!!");
    startAlarm();  
  }

  if (metThresh <= (int)methane){
    Serial.println("\nMethane Alarm !!!");
    startAlarm();  
  }

  if (motionData == motThresh){
    Serial.println("\nMotion Alarm !!!");
    startAlarm();  
  }
  
  // convert datas to String.
  String tmpStr = String(temperature);
  String hmdStr = String(humidity);
  String mthStr = String(metToSend);
  String motStr = String(motToSend);

  // print datas on serial monitor.
  Serial.println();
  
  Serial.print(motionData);
  Serial.print(" , ");
  Serial.print(temperature);
  Serial.print(" , ");
  Serial.print(humidity);  
  Serial.print(" , ");
  Serial.println(methane);  

  Serial.print(motThresh); 
  Serial.print(" , ");
  Serial.print(tmpThresh);
  Serial.print(" , ");
  Serial.print(hmdThresh);
  Serial.print(" , ");
  Serial.println(metThresh);  

  Serial.println(); 

  // begin http request.
  int currentMillis = millis();
  if (currentMillis - timer >= timeInt){
    timer = currentMillis;  

    // checks wifi connection status.
    if (WiFi.status() == WL_CONNECTED) { 

      // declaring http struct.
      HTTPClient http;

      // request address.
      http.begin("http://52.91.149.205/api/circuitdatas");     
      http.addHeader("Content-Type", "application/json"); 

      // post request body handling.
      int motData = (int)digitalRead(motion);
      String mtStr = String(motData);
      int httpCode = http.POST("{\"key\":\""+ key +"\", \"motion\":\"" + motStr + "\", \"temperature\":\"" + tmpStr + "\", \"humidity\":\"" + hmdStr + "\", \"methane\":\"" + methane + "\"}");   //Send the request
      String payload = http.getString();

      // parse the request response
      //Serial.println(payload);
      //String key = JsonParser(0, String(payload));
      String relay = JsonParser(1, String(payload));
      String tmp = JsonParser(2, String(payload));
      String hmd = JsonParser(3, String(payload));
      String met = JsonParser(4, String(payload));
      String mot = JsonParser(5, String(payload));

      // print parsed datas on serial monitor.
      Serial.println("\nINCOMING PAYLOAD...");
      Serial.println(payload);
      Serial.println();
      Serial.println("RECEIVED Thresholds:");
      Serial.print("Relay: "); Serial.println(relay);
      Serial.print("Temperature: "); Serial.println(tmp);
      Serial.print("Humidity: "); Serial.println(hmd);
      Serial.print("Methane: "); Serial.println(met);
      Serial.print("Motion: "); Serial.println(mot);

      // according to response on or off relay.
      if (relay == "true"){
        digitalWrite(relayPin, LOW);  
      }else {
        digitalWrite(relayPin, HIGH);  
      }

      // setting thresholds.
      if (tmp != "200"){
        tmpThresh = (int) tmp.toInt();
      }
      if (hmd != "200"){
        hmdThresh = (int) hmd.toInt();
      }
      if (met != "200"){
        metThresh = (int) met.toInt();
      }
      if (mot != "200"){
        motThresh = (int) mot.toInt();
      }

      // print thresholds.
      Serial.println();
      Serial.println("UPDATED Thresholds:");
      Serial.print("Temperature: "); Serial.println(tmpThresh);
      Serial.print("Humidity: "); Serial.println(hmdThresh);
      Serial.print("Methane: "); Serial.println(metThresh);
      Serial.print("Motion: "); Serial.println(motThresh);

      metToSend = 0;
      motToSend = 0;

      // end http request.
      http.end(); 
   
    } else {
      Serial.println("Error in WiFi connection");
    }
  }

  // wait for 5 seconds.
  delay(5000);
 
}

// starting an alarm function.
void startAlarm(){
  int counter = 0;
  while(counter < 4){
    delay(500);
    digitalWrite(buzzerPin, HIGH);
    delay(1000);
    digitalWrite(buzzerPin, LOW);

    counter += 1;
  }  
}

// request response json parser.
String JsonParser(int index, String data){
  String circuitData;
  char buff[250];
  int quoteCounter = 0;
  switch(index){
    case 0:
      // fetch circuit key.
      data.toCharArray(buff, 250);
      for(int i = 0 ; i<250 ; i++){
        if (buff[i] == '"'){
          quoteCounter += 1;  
        }
        if (quoteCounter >= 9 && quoteCounter <= 10){
          if (buff[i] != '"' && buff[i] != ':' && buff[i] != ','){
            circuitData.concat(buff[i]);
          }
        }
      }
      break;
    case 1:
      // fetch relay.
      data.toCharArray(buff, 250);
      for(int i = 0 ; i<250 ; i++){
        if (buff[i] == '"'){
          quoteCounter += 1;  
        }
        if (quoteCounter >= 12 && quoteCounter < 13){
          if (buff[i] != '"' && buff[i] != ':' && buff[i] != ','){
            circuitData.concat(buff[i]);
          }
        }
      }
      break;
    case 2:
      // fetch temperature.
      data.toCharArray(buff, 250);
      for(int i = 0 ; i<250 ; i++){
        if (buff[i] == '"'){
          quoteCounter += 1;  
        }
        if (quoteCounter >= 14 && quoteCounter < 15){
          if (buff[i] != '"' && buff[i] != ':' && buff[i] != ','){
            circuitData.concat(buff[i]);
          }
        }
      }
      break;
    case 3:
      // fetch humidity.
      data.toCharArray(buff, 250);
      for(int i = 0 ; i<250 ; i++){
        if (buff[i] == '"'){
          quoteCounter += 1;  
        }
        if (quoteCounter >= 16 && quoteCounter < 17){
          if (buff[i] != '"' && buff[i] != ':' && buff[i] != ','){
            circuitData.concat(buff[i]);
          }
        }
      }
      break;
    case 4:
      // fetch methane.
      data.toCharArray(buff, 250);
      for(int i = 0 ; i<250 ; i++){
        if (buff[i] == '"'){
          quoteCounter += 1;  
        }
        if (quoteCounter > 17 && quoteCounter <= 18){
          if (buff[i] != '"' && buff[i] != ':' && buff[i] != ','){
            circuitData.concat(buff[i]);
          }
        }
      }
      break;
    case 5:
      // fetch motion.
      data.toCharArray(buff, 250);
      for(int i = 0 ; i<250 ; i++){
        if (buff[i] == '"'){
          quoteCounter += 1;  
        }
        if (quoteCounter > 19 && quoteCounter <= 20){
          if (buff[i] != '"' && buff[i] != ':' && buff[i] != ','){
            circuitData.concat(buff[i]);
          }
        }
      }
      break;
  }
  return circuitData;
}
