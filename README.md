# Comparis fiber checker

So, you're looking for a new comfy and reasonably priced place to stay but you
really need that fast internet that you've always wanted.

**Fear no more.**

Now you can just browse all the results on [comparis](https://www.comparis.ch/immobilien/default) and see
if the place already provides fiber support. 

currently Salt (10GBit/s) and Init7
(1Gbit/s) + VDSL.

### How to

#### Requirement
Current Chrome version

#### Easy way
Install from the [Chrome web store](ttps://chrome.google.com/webstore/detail/lmafadnjikhmoeofhiakoaikceofphcd/)

#### Manually
- open ``chrome://extensions``
- activate Developer mode (top right)
- click on Load unpacked 
- point to your cloned folder

After you've got your new apartment. Don't forget to remove the extension.

##### Security 
The extension should only activate on the following Url:
``http://www.comparis.ch/immobilien/*``

It also has access to the following endpoints for Ajax calls.
- https://fiber.salt.ch/
- https://api.init7.net/
- the current active tab

##### Known Problems
- It's a bit slow :D

##### Limitations
- Sorry only for CH Users :(
- Doesn't work on other sites
- Uses hardcoded endpoints

![Comparis overview](git_images/checker.png "Comparis check")

