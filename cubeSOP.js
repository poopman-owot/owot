

function CellToPixelCoords(tileX, tileY, charX, charY) {
  if (Array.isArray(tileX)) {
    // If the first argument is an array, destructure the values
    [tileX, tileY, charX, charY] = tileX;
  }
  tileX /= 2;
  tileY /= 2;
  // calculate in-tile cell position
  var charXInTile = tileX * tileC + charX;
  var charYInTile = tileY * tileR + charY;

  // calculate global cell position
  var charXGlobal = Math.floor(tileX * tileC * cellW + charXInTile * cellW + positionX + Math.trunc(owotWidth / 2));
  var charYGlobal = Math.floor(tileY * tileR * cellH + charYInTile * cellH + positionY + Math.trunc(owotHeight / 2));

  return [charXGlobal, charYGlobal];
}
    const [a, b] = CellToPixelCoords(-1, -1, 0, 0);
    const [c, d] = CellToPixelCoords(0, 0, 15, 7);  

const [e,f] = [((a+c)/2)-250-positionX,((b+d)/2)-250-positionY]
    function loadThreeJS() {
      const script = document.createElement('script');
      script.onload = initializeScene;
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.154.0/three.min.js'; // Replace with the actual path to Three.js

      document.head.appendChild(script);
    }

    function initializeScene() {
      // Initialize the scene, camera, and renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(500, 500);
      renderer.setClearColor(0x000000, 0);

      // Create a fixed-position canvas element
      const canvasContainer = document.createElement('div');
      canvasContainer.style.position = 'fixed';
      canvasContainer.style.top = '0';
      canvasContainer.style.left = '0';
      canvasContainer.style.width = '100%';
      canvasContainer.style.height = '100%';
      canvasContainer.appendChild(renderer.domElement);
canvasContainer.id="canvasContainer"
  canvasContainer.style.pointerEvents = 'none';
      // Append the canvas container to the document's body
      document.body.appendChild(canvasContainer);

      // Create a directional light
      const light = new THREE.DirectionalLight(0xffffff, 1.0);
      light.position.set(1, 1, 1); // Set the light direction
      scene.add(light);

      // Create an ambient light to provide some global illumination
      const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
      scene.add(ambientLight);

      // Define the desired width of the cube in pixels


  // Create a cube mesh
  const geometry = new THREE.BoxGeometry(cellW/3.2, cellW/3.2, cellW/3.2);
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: new THREE.DataTexture() });
  const cube = new THREE.Mesh(geometry, material);
cube.rotation.y = -(315/100)
  scene.add(cube);

  // Create a white material for the rectangle (unlit)
  const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, emissive: 0xffffff });
  const rectGeometry = new THREE.PlaneGeometry(cellW, cellW); // Adjust size as needed
  const rectangle = new THREE.Mesh(rectGeometry, whiteMaterial);
  rectangle.position.z = -5; // Position the rectangle behind the cube
  scene.add(rectangle);

      // Position the camera
      camera.position.z = 5;

      // Define a function to load the canvas data and update the cube's texture
// Define a function to load the canvas data and update the cube's texture
  // Define a function to flip the canvas data horizontally and update the cube's texture
  function updateCubeTexture() {
    const canvas = owotCtx.canvas;
    const [x, y] = CellToPixelCoords(-1, -1, 0, 0);
    const [x2, y2] = CellToPixelCoords(0, 0, 15, 7);

    // Get the canvas data
    const canvasData = owotCtx.getImageData(x, y, x2 - x, y2 - y).data;

    // Flip the canvas data horizontally
    const flippedData = new Uint8Array(canvasData.length);
    const width = x2 - x;
    const height = y2 - y;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcIndex = (y * width + x) * 4;
        const dstIndex = (y * width + (width - 1 - x)) * 4;
        flippedData[dstIndex] = canvasData[srcIndex]; // Red component
        flippedData[dstIndex + 1] = canvasData[srcIndex + 1]; // Green component
        flippedData[dstIndex + 2] = canvasData[srcIndex + 2]; // Blue component
        flippedData[dstIndex + 3] = canvasData[srcIndex + 3]; // Alpha component
      }
    }

    // Create a new DataTexture with the flipped canvas data
    const texture = new THREE.DataTexture(flippedData, width, height, THREE.RGBAFormat);
    texture.needsUpdate = true;

    // Apply the texture to the cube's material
    cube.material.map = texture;
    cube.material.needsUpdate = true;
  const canvasContainer = document.getElementById('canvasContainer');
  canvasContainer.style.left = positionX +e + 'px';
  canvasContainer.style.top = positionY+f + 'px';
  }



      // Call the function to update the cube's texture
    

      // Define an animation loop
      function animate() {
  updateCubeTexture();

        // Rotate the cube on each frame
        cube.rotation.x = -((158)/100);
        cube.rotation.y +=0.01
cube.rotation.z +=0.01
        // Render the scene with the camera
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }

      // Start the animation loop
      animate();
    }

    // Load Three.js dynamically and initialize the scene after it's loaded
    loadThreeJS();

