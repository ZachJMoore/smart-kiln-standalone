## Smart Kiln (standalone version)

This is a standalone version of the "Smart Kiln" project with no online access.

The repository for the UI of this project can be found <a href="https://github.com/ZachJMoore/smart-kiln-standalone-ui">here</a>.

## Hardware Setup

#### Parts:
- <a href="https://www.amazon.com/gp/product/B07BC6WH7V/ref=oh_aui_detailpage_o00_s00?ie=UTF8&psc=1">Raspberry Pi</a>
- <a href="https://www.amazon.com/gp/product/B0153R2A9I/ref=oh_aui_search_detailpage?ie=UTF8&psc=1">7" Touchscreen</a>
- <a href="https://www.amazon.com/gp/product/B06XWN9Q99/ref=oh_aui_detailpage_o00_s00?ie=UTF8&psc=1">SD Card</a>
- <a href="https://www.amazon.com/gp/product/B0753XW76H/ref=oh_aui_detailpage_o00_s01?ie=UTF8&psc=1">Solid State Relay</a>
- <a href="https://www.amazon.com/gp/product/B00SK8NDAI/ref=oh_aui_detailpage_o00_s01?ie=UTF8&psc=1">Thermocouple Amplifier</a>
- <a href="http://www.theceramicshop.com/product/10885/Type-K-Thermocouple-8B/">Ceramic type-k Thermocouple</a>

### Wiring:

#### soldered parts
![simple-wiring](https://github.com/ZachJMoore/smart-kiln-standalone/blob/master/simple-wiring.png?raw=true)

The thermocouple are screwed directly to the amp. Neutral/ground coming back from the kiln elements can then also be screwed into the relay to programmatically close the circuit

### Software Setup

After enabling SPI to be used on the raspberry pi, in the smart-kiln-standalone project directory, run in terminal the following to start app:

```
    $ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    $ sudo apt-get install -y nodejs
    $ npm install
    $ node app/app.js
```

On the Pis browser, navigate to localhost:2222, which will present you with a web app to interface with the kiln. Currently this is locked to only being accessible from the Pi itself for safety reason.

Help is very welcome, please feel free to make a pull request!