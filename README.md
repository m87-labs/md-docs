# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## Modifying the content
To add a doc, simply create a .md file inside the docs folder and add the content you want. It will automatically be compiled and added to the website.

To add a category/folder, it's the same process. Create the folder inside docs and it will add it automatically.

For code documentation, here is an example of adding code to the markdown:

# Code Block Examples

### Code Tabs

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="js" label="JavaScript" default>
  
  ```javascript
  const greeting = "Hello, World!";
  console.log(greeting);
  ```
  
  </TabItem>
  <TabItem value="py" label="Python">
  
  ```python
  greeting = "Hello, World!"
  print(greeting)
  ```
  
  </TabItem>
  <TabItem value="java" label="Java">
  
  ```java
  public class HelloWorld {
      public static void main(String[] args) {
          System.out.println("Hello, World!");
      }
  }
  ```
  
  </TabItem>
</Tabs>

### Standard

```python
greeting = "Hello, World!"
print(greeting)
```

### Modifying aesthetics
In order to change the look of the website, you can adjust the themes inside docusaurus.config.ts or you can modify CSS inside custom.css. Docusaurus uses custom flags that can be identified from the inspect menu, in order to properly change the colors. 

### Modifying the URL
If you change the URL of the site, make sure to update docusaurus.config.ts (both url and BaseURL) to match it. It needs to be the correct URL in order to build properly.
