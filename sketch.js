// 儲存角色待機、走路、跑步、跳躍與攻擊精靈圖。
let spriteSheets = {}; // 記錄角色動作的水平精靈圖。
let characters = {}; // 記錄各角色各動作切分後的影格。
let actors = []; // 記錄角色位置、方向與跳躍狀態。
let forestTrees = []; // 記錄森林樹木的繪圖資料。
let fireflies = []; // 記錄森林螢火蟲的繪圖資料。

// 預先載入兩位角色的待機、走路、跑步、跳躍與攻擊精靈圖。
function preload() { // 在建立畫布前載入所有角色動作圖片。
  spriteSheets = { // 依照玩家及動作分類載入圖片。
    left: { // 設定左側角色 1 的動作圖片。
      idle: loadImage("1/stop/stop.png", undefined, () => console.error("無法載入圖片：1/stop/stop.png")), // 載入左側角色待機圖片。
      walk: loadImage("1/work/work.png", undefined, () => console.error("無法載入圖片：1/work/work.png")), // 載入左側角色走路圖片。
      run: loadImage("1/run/run.png", undefined, () => console.error("無法載入圖片：1/run/run.png")), // 載入左側角色跑步圖片。
      jump: loadImage("1/jump/jump.png", undefined, () => console.error("無法載入圖片：1/jump/jump.png")), // 載入左側角色跳躍圖片。
      attack: loadImage("1/forwork/forwork.png", undefined, () => console.error("無法載入圖片：1/forwork/forwork.png")), // 載入左側角色攻擊圖片。
    }, // 完成左側角色圖片清單。
    right: { // 設定右側角色 2 的動作圖片。
      idle: loadImage("2/stop/stop.png", undefined, () => console.error("無法載入圖片：2/stop/stop.png")), // 載入右側角色待機圖片。
      walk: loadImage("2/work/work.png", undefined, () => console.error("無法載入圖片：2/work/work.png")), // 載入右側角色走路圖片。
      run: loadImage("2/run/run.png", undefined, () => console.error("無法載入圖片：2/run/run.png")), // 載入右側角色跑步圖片。
      jump: loadImage("2/jump/jump.png", undefined, () => console.error("無法載入圖片：2/jump/jump.png")), // 載入右側角色跳躍圖片。
      attack: loadImage("2/forwork/forwork.png", undefined, () => console.error("無法載入圖片：2/forwork/forwork.png")), // 載入右側角色攻擊圖片。
    }, // 完成右側角色圖片清單。
  }; // 完成所有角色圖片清單。
} // 結束圖片預載函式。

// 建立全螢幕畫布與動畫素材。
function setup() { // 初始化畫布及背景資料。
  createCanvas(windowWidth, windowHeight); // 建立填滿瀏覽器視窗的畫布。
  imageMode(CENTER); // 以圖片中心點作為繪圖座標。
  frameRate(30); // 設定動畫更新速度。
  characters = { // 將每張水平精靈圖切成獨立動畫影格。
    left: { // 切分左側角色的各種動作圖片。
      idle: splitSpriteSheet(spriteSheets.left.idle), // 切分左側角色待機影格。
      walk: splitSpriteSheet(spriteSheets.left.walk), // 切分左側角色走路影格。
      run: splitSpriteSheet(spriteSheets.left.run), // 切分左側角色跑步影格。
      jump: splitSpriteSheet(spriteSheets.left.jump), // 切分左側角色跳躍影格。
      attack: splitSpriteSheet(spriteSheets.left.attack), // 切分左側角色攻擊影格。
    }, // 完成左側角色影格清單。
    right: { // 切分右側角色的各種動作圖片。
      idle: splitSpriteSheet(spriteSheets.right.idle), // 切分右側角色待機影格。
      walk: splitSpriteSheet(spriteSheets.right.walk), // 切分右側角色走路影格。
      run: splitSpriteSheet(spriteSheets.right.run), // 切分右側角色跑步影格。
      jump: splitSpriteSheet(spriteSheets.right.jump), // 切分右側角色跳躍影格。
      attack: splitSpriteSheet(spriteSheets.right.attack), // 切分右側角色攻擊影格。
    }, // 完成右側角色影格清單。
  }; // 完成所有角色影格切分。
  const characterHeight = min(height * 0.4, width * 0.23, 260); // 計算角色的共用顯示高度。
  actors = [ // 建立左右兩位角色的遊戲狀態。
    createActor(characters.left, width / 2 - characterHeight * 0.55, 1), // 將左側角色 1 設定為預設面向右邊。
    createActor(characters.right, width / 2 + characterHeight * 0.55, -1), // 將右側角色 2 設定為預設面向左邊。
  ]; // 完成角色遊戲狀態建立。
  createForest(); // 建立多層森林樹木。
  createFireflies(); // 建立森林螢火蟲。
} // 結束畫布初始化函式。

// 根據影格之間的透明間隔切分水平精靈圖。
function splitSpriteSheet(sheet) { // 回傳精靈圖中的角色影格。
  sheet.loadPixels(); // 讀取圖片像素以判斷透明間隔。
  const frames = []; // 建立影格清單。
  let frameStart = -1; // 記錄目前影格的起始欄位。
  for (let x = 0; x < sheet.width; x += 1) { // 由左至右掃描圖片欄位。
    let hasPixels = false; // 記錄欄位是否含有不透明像素。
    for (let y = 0; y < sheet.height; y += 1) { // 檢查目前欄位的每個像素。
      if (sheet.pixels[(y * sheet.width + x) * 4 + 3] > 0) { // 找到不透明像素時。
        hasPixels = true; // 標記目前欄位屬於角色影格。
        break; // 結束目前欄位的像素檢查。
      } // 結束不透明像素判斷。
    } // 結束目前欄位的掃描。
    if (hasPixels && frameStart === -1) { // 偵測到新影格的第一欄時。
      frameStart = x; // 記錄新影格的起始位置。
    } // 結束影格起點判斷。
    if (!hasPixels && frameStart !== -1) { // 偵測到影格後方的透明間隔時。
      frames.push(sheet.get(frameStart, 0, x - frameStart, sheet.height)); // 擷取目前影格。
      frameStart = -1; // 重設影格起點以尋找下一格。
    } // 結束影格擷取判斷。
  } // 結束圖片欄位掃描。
  if (frameStart !== -1) { // 如果最後一格延伸至圖片右側邊界。
    frames.push(sheet.get(frameStart, 0, sheet.width - frameStart, sheet.height)); // 擷取最後一格影格。
  } // 結束最後影格擷取判斷。
  return frames; // 回傳切分完成的動畫影格。
} // 結束精靈圖切分函式。

// 每一格繪製森林背景、螢火蟲與角色動畫。
function draw() { // 更新並繪製目前動畫畫面。
  updateCharacters(); // 根據鍵盤輸入更新角色動作與位置。
  drawForest(); // 繪製全螢幕森林背景。
  drawFireflies(); // 繪製森林中的螢火蟲。
  drawCharacters(); // 繪製面對彼此的角色動畫。
  drawAttackEffects(); // 在角色攻擊時繪製專屬閃光特效。
  drawControlFooter(); // 在畫布底部繪製兩位角色的按鍵操作說明。
} // 結束畫面繪製函式。

// 使用方向鍵控制右側角色，使用 Z、X、C、S 控制左側角色。
function keyPressed() { // 在按下跳躍鍵時啟動單次跳躍。
  if (keyCode === UP_ARROW) { // 按下上方向鍵時。
    actors[1].jumpRequested = true; // 要求右側角色 2 跳躍。
  } // 結束右側角色跳躍輸入判斷。
  if (key.toLowerCase() === "s") { // 按下 S 鍵時。
    actors[0].jumpRequested = true; // 要求左側角色 1 跳躍。
  } // 結束左側角色跳躍輸入判斷。
  if ([LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW, 32].includes(keyCode) || "zxcs".includes(key.toLowerCase())) { // 按下遊戲控制按鍵時。
    return false; // 避免方向鍵捲動網頁並阻止瀏覽器預設操作。
  } // 結束遊戲按鍵預設行為處理。
} // 結束按鍵事件函式。

// 建立一位角色的移動、方向與動畫狀態。
function createActor(sprites, x, facing) { // 回傳角色的初始遊戲狀態。
  return { // 建立角色狀態物件。
    sprites: sprites, // 儲存角色各種動作影格。
    x: x, // 設定角色水平位置。
    facing: facing, // 設定角色目前面向方向。
    verticalOffset: 0, // 設定角色目前跳躍高度。
    verticalVelocity: 0, // 設定角色垂直速度。
    airborne: false, // 設定角色目前位於地面。
    jumpRequested: false, // 設定是否收到跳躍要求。
    jumpStartedAt: 0, // 記錄跳躍動畫的起始畫格。
    jumpDuration: 1, // 記錄一次跳躍的預期畫格數。
    attackKeyWasDown: false, // 記錄上一畫格是否按住攻擊組合鍵。
    attackActive: false, // 記錄角色是否正在攻擊。
    attackStartedAt: 0, // 記錄攻擊動畫的起始畫格。
    attackDuration: 1, // 記錄一次攻擊動畫的持續畫格數。
    action: "idle", // 設定角色初始為待機動作。
    actionStartedAt: 0, // 記錄目前動作動畫的起始畫格。
  }; // 完成角色狀態物件。
} // 結束角色狀態建立函式。

// 依照兩組控制鍵更新角色動作、水平移動與跳躍物理。
function updateCharacters() { // 每個動畫畫格更新兩位角色。
  const leftInput = { // 讀取左側角色 1 的按鍵狀態。
    left: keyIsDown(90), // 將 Z 鍵設定為向左移動。
    right: keyIsDown(67), // 將 C 鍵設定為向右移動。
    run: keyIsDown(88), // 將 X 鍵設定為跑步。
    attack: keyIsDown(32) && keyIsDown(90) !== keyIsDown(67), // 將空白鍵加上單一方向鍵設定為攻擊。
  }; // 完成左側角色輸入狀態。
  const rightInput = { // 讀取右側角色 2 的方向鍵狀態。
    left: keyIsDown(LEFT_ARROW), // 將左方向鍵設定為向左移動。
    right: keyIsDown(RIGHT_ARROW), // 將右方向鍵設定為向右移動。
    run: keyIsDown(DOWN_ARROW), // 將下方向鍵設定為跑步。
    attack: keyIsDown(32) && keyIsDown(LEFT_ARROW) !== keyIsDown(RIGHT_ARROW), // 將空白鍵加上單一方向鍵設定為攻擊。
  }; // 完成右側角色輸入狀態。
  updateActor(actors[0], leftInput); // 更新左側角色 1。
  updateActor(actors[1], rightInput); // 更新右側角色 2。
} // 結束角色更新函式。

// 更新單一角色的移動方向、跑步狀態與跳躍軌跡。
function updateActor(actor, input) { // 依照輸入更新角色遊戲狀態。
  const direction = Number(input.right) - Number(input.left); // 計算目前的水平移動方向。
  const characterHeight = min(height * 0.4, width * 0.23, 260); // 計算角色共用顯示高度。
  const walkSpeed = characterHeight * 0.024; // 設定走路速度。
  const runSpeed = characterHeight * 0.043; // 設定跑步速度。
  const gravity = characterHeight * 0.0025; // 設定跳躍下落重力。
  const attackJustPressed = input.attack && !actor.attackKeyWasDown; // 判斷攻擊組合鍵是否剛按下。
  actor.attackKeyWasDown = input.attack; // 記錄目前攻擊組合鍵狀態。
  if (direction !== 0) { // 有水平方向輸入時。
    actor.facing = direction; // 讓角色面向移動方向。
  } // 結束角色面向更新。
  if (attackJustPressed && !actor.airborne) { // 攻擊組合鍵剛按下且角色位於地面時。
    actor.attackActive = true; // 啟動角色攻擊動作。
    actor.attackStartedAt = frameCount; // 記錄攻擊動畫起始畫格。
    actor.attackDuration = actor.sprites.attack.length * 2; // 設定攻擊動畫完整播放時間。
    actor.facing = direction; // 讓角色朝攻擊方向面對。
  } // 結束攻擊啟動判斷。
  if (actor.attackActive && frameCount - actor.attackStartedAt >= actor.attackDuration) { // 攻擊動畫播放完畢時。
    actor.attackActive = false; // 結束攻擊並允許其他動作接續。
  } // 結束攻擊完成判斷。
  if (actor.jumpRequested && !actor.airborne && !actor.attackActive) { // 收到跳躍要求且角色位於地面、未攻擊時。
    actor.verticalVelocity = -characterHeight * 0.05; // 設定向上的跳躍初速度。
    actor.airborne = true; // 將角色標記為正在空中。
    actor.jumpStartedAt = frameCount; // 記錄跳躍動畫起始畫格。
    actor.jumpDuration = ceil((2 * abs(actor.verticalVelocity)) / gravity); // 計算跳躍往返的預期時間。
  } // 結束跳躍啟動判斷。
  actor.jumpRequested = false; // 清除已處理的跳躍要求。
  if (actor.airborne) { // 角色正在空中時。
    actor.verticalOffset += actor.verticalVelocity; // 依照垂直速度更新跳躍高度。
    actor.verticalVelocity += gravity; // 依照重力更新垂直速度。
    if (actor.verticalOffset >= 0) { // 角色落回地面時。
      actor.verticalOffset = 0; // 將角色放回地面高度。
      actor.verticalVelocity = 0; // 停止垂直移動。
      actor.airborne = false; // 將角色標記為已落地。
    } // 結束落地判斷。
  } // 結束跳躍物理更新。
  const running = input.run && direction !== 0 && !actor.airborne; // 判斷角色是否正在地面跑步。
  actor.action = actor.attackActive ? "attack" : input.attack ? "idle" : actor.airborne ? "jump" : direction === 0 ? "idle" : running ? "run" : "walk"; // 攻擊組合鍵按住時避免動作結束後誤轉為走路。
  if (actor.action === "walk" || actor.action === "run") { // 角色正在地面走路或跑步時。
    actor.x += direction * (running ? runSpeed : walkSpeed); // 依照走路或跑步速度更新水平位置。
  } else if (actor.airborne && direction !== 0) { // 跳躍中仍按著水平方向鍵時。
    actor.x += direction * walkSpeed; // 讓角色朝指定方向進行水平跳躍。
  } // 結束角色水平移動判斷。
  actor.x = constrain(actor.x, characterHeight * 0.55, width - characterHeight * 0.55); // 將角色限制在畫面範圍內。
  if (actor.action !== actor.previousAction) { // 角色切換動作時。
    actor.actionStartedAt = frameCount; // 重設目前動作動畫的起始畫格。
    actor.previousAction = actor.action; // 記錄目前角色動作。
  } // 結束動作動畫起始時間更新。
} // 結束單一角色更新函式。

// 建立遠景、中景與近景樹木。
function createForest() { // 依照畫面寬度配置樹木。
  forestTrees = []; // 清除先前建立的樹木資料。
  randomSeed(24); // 固定樹木排列以避免視窗重繪時閃爍。
  for (let layer = 0; layer < 3; layer += 1) { // 逐層建立森林樹木。
    const spacing = map(layer, 0, 2, 112, 78); // 設定各景深樹木間距。
    const count = ceil(width / spacing) + 2; // 計算填滿畫面所需的樹木數量。
    for (let index = 0; index < count; index += 1) { // 建立目前景深的每棵樹。
      forestTrees.push({ // 將隨機外觀的樹木加入森林。
        x: index * spacing - spacing + random(-spacing * 0.3, spacing * 0.3), // 設定樹木水平位置。
        y: height * map(layer, 0, 2, 0.5, 0.77) + random(-height * 0.035, height * 0.035), // 設定樹木基準高度。
        size: random(0.75, 1.25) * map(layer, 0, 2, 0.8, 1.25), // 設定樹木大小。
        layer: layer, // 記錄樹木所在景深。
        hue: random(0, 1), // 設定樹木葉片色彩變化。
        shape: floor(random(0, 2)), // 選擇圓冠樹或尖葉樹造型。
        phase: random(TWO_PI), // 設定樹冠搖曳的動畫相位。
      }); // 完成單棵樹木資料。
    } // 結束目前景深樹木建立。
  } // 結束所有景深樹木建立。
} // 結束森林樹木建立函式。

// 建立森林中閃爍的螢火蟲。
function createFireflies() { // 根據畫面大小配置螢火蟲。
  fireflies = []; // 清除先前建立的螢火蟲資料。
  for (let index = 0; index < 42; index += 1) { // 建立一群螢火蟲。
    fireflies.push({ // 將具有獨立動畫參數的螢火蟲加入清單。
      x: random(width), // 設定螢火蟲水平位置。
      y: random(height * 0.18, height * 0.78), // 設定螢火蟲垂直位置。
      size: random(1.5, 4), // 設定螢火蟲光點大小。
      phase: random(TWO_PI), // 設定螢火蟲閃爍相位。
      drift: random(0.3, 1.2), // 設定螢火蟲漂浮速度。
    }); // 完成單隻螢火蟲資料。
  } // 結束螢火蟲建立。
} // 結束螢火蟲建立函式。

// 繪製暮色天空、月亮、山巒及分層森林。
function drawForest() { // 重繪整個森林背景。
  const skyTop = color(14, 28, 48); // 設定天空上方的深藍色。
  const skyBottom = color(45, 80, 83); // 設定地平線附近的青綠色。
  noStroke(); // 移除天空色帶邊框以避免色帶間出現空隙。
  for (let y = 0; y < height; y += 4) { // 以細長色帶填滿漸層天空。
    fill(lerpColor(skyTop, skyBottom, y / height)); // 設定目前色帶的漸層顏色。
    rect(0, y, width, 5); // 繪製稍微重疊的天空色帶。
  } // 結束天空漸層繪製。
  fill(232, 224, 172, 190); // 設定月亮顏色。
  circle(width * 0.78, height * 0.19, min(width, height) * 0.09); // 在天空繪製月亮。
  fill(14, 28, 48, 120); // 設定月牙陰影顏色。
  circle(width * 0.8, height * 0.17, min(width, height) * 0.085); // 遮住月亮一側形成月牙。
  fill(61, 93, 104, 170); // 設定遠方山巒顏色。
  beginShape(); // 開始繪製遠方山巒。
  vertex(0, height * 0.57); // 設定山巒左側起點。
  vertex(width * 0.16, height * 0.39); // 設定左側山峰。
  vertex(width * 0.31, height * 0.56); // 設定左側山谷。
  vertex(width * 0.49, height * 0.35); // 設定中央山峰。
  vertex(width * 0.7, height * 0.57); // 設定中央山谷。
  vertex(width * 0.87, height * 0.4); // 設定右側山峰。
  vertex(width, height * 0.54); // 設定山巒右側邊界。
  vertex(width, height); // 延伸山巒至畫面右下角。
  vertex(0, height); // 延伸山巒至畫面左下角。
  endShape(CLOSE); // 完成遠方山巒。
  for (let tree of forestTrees) { // 由遠至近繪製所有樹木。
    drawTree(tree); // 繪製具有搖曳效果的樹木。
  } // 結束森林樹木繪製。
  noStroke(); // 移除地面邊框。
  fill(17, 35, 38, 210); // 設定森林地面顏色。
  rect(0, height * 0.79, width, height * 0.21); // 繪製畫面底部的森林地面。
} // 結束森林背景繪製函式。

// 繪製具有輕柔搖曳效果的樹木。
function drawTree(tree) { // 根據樹木資料繪製樹幹與樹冠。
  const depth = tree.layer; // 讀取目前樹木的景深。
  const scale = tree.size * map(depth, 0, 2, 0.72, 1.18); // 計算樹木縮放比例。
  const treeHeight = height * 0.3 * scale; // 計算樹木高度。
  const treeWidth = treeHeight * 0.56; // 計算樹木寬度。
  const sway = sin(frameCount * 0.025 + tree.phase) * treeWidth * 0.035; // 計算樹冠搖曳幅度。
  const greens = [color(35, 72, 75), color(25, 59, 61), color(17, 43, 46)]; // 設定不同景深的葉片色彩。
  const shade = lerpColor(greens[depth], color(71, 108, 86), tree.hue * 0.32); // 混合樹木葉片顏色。
  noStroke(); // 移除樹木圖形邊框。
  fill(13, 30, 35, 180); // 設定樹幹陰影顏色。
  rect(tree.x - treeWidth * 0.055, tree.y - treeHeight * 0.27, treeWidth * 0.11, treeHeight * 0.29); // 繪製樹幹。
  fill(shade); // 設定目前樹木的葉片顏色。
  if (tree.shape === 0) { // 使用圓冠樹造型時。
    ellipse(tree.x + sway, tree.y - treeHeight * 0.55, treeWidth * 0.82, treeHeight * 0.38); // 繪製圓形樹冠中央。
    ellipse(tree.x - treeWidth * 0.2 + sway, tree.y - treeHeight * 0.49, treeWidth * 0.55, treeHeight * 0.31); // 繪製圓形樹冠左側。
    ellipse(tree.x + treeWidth * 0.2 + sway, tree.y - treeHeight * 0.48, treeWidth * 0.56, treeHeight * 0.33); // 繪製圓形樹冠右側。
  } else { // 使用尖葉樹造型時。
    triangle(tree.x + sway, tree.y - treeHeight, tree.x - treeWidth * 0.36, tree.y - treeHeight * 0.35, tree.x + treeWidth * 0.36, tree.y - treeHeight * 0.35); // 繪製尖葉樹上層。
    triangle(tree.x + sway, tree.y - treeHeight * 0.77, tree.x - treeWidth * 0.48, tree.y - treeHeight * 0.16, tree.x + treeWidth * 0.48, tree.y - treeHeight * 0.16); // 繪製尖葉樹下層。
    rect(tree.x - treeWidth * 0.05, tree.y - treeHeight * 0.27, treeWidth * 0.1, treeHeight * 0.19); // 連接尖葉樹的樹幹。
  } // 結束樹木造型判斷。
} // 結束樹木繪製函式。

// 更新並繪製閃爍、漂浮的螢火蟲。
function drawFireflies() { // 繪製森林中的所有螢火蟲。
  noStroke(); // 移除螢火蟲光點邊框。
  for (let firefly of fireflies) { // 逐一更新螢火蟲動畫。
    const flicker = (sin(frameCount * 0.045 + firefly.phase) + 1) / 2; // 計算螢火蟲閃爍亮度。
    const floatY = sin(frameCount * 0.018 * firefly.drift + firefly.phase) * 10; // 計算螢火蟲垂直漂浮位置。
    fill(249, 229, 139, 55 + flicker * 145); // 設定螢火蟲光暈顏色。
    circle(firefly.x, firefly.y + floatY, firefly.size * (2 + flicker * 2)); // 繪製螢火蟲光暈。
    fill(255, 247, 185, 140 + flicker * 115); // 設定螢火蟲中心亮點顏色。
    circle(firefly.x, firefly.y + floatY, firefly.size); // 繪製螢火蟲中心亮點。
  } // 結束螢火蟲繪製。
} // 結束螢火蟲動畫函式。

// 依照目前動作繪製兩位角色並循環播放走路或跑步影格。
function drawCharacters() { // 更新並繪製角色動畫。
  const characterHeight = min(height * 0.4, width * 0.23, 260); // 設定兩位角色共用的顯示高度。
  for (let index = 0; index < actors.length; index += 1) { // 逐一繪製兩位角色。
    const actor = actors[index]; // 讀取目前角色的遊戲狀態。
    const frames = actor.sprites[actor.action]; // 讀取目前動作的動畫影格。
    if (frames.length === 0) { // 角色精靈圖沒有可用影格時。
      console.error(`角色 ${index + 1} 的 ${actor.action} 動作沒有可用影格。`); // 回報精靈圖格式錯誤。
      continue; // 略過目前角色以避免繪圖錯誤。
    } // 結束無影格判斷。
    const frameInterval = actor.action === "run" ? 3 : actor.action === "walk" ? 5 : 6; // 設定不同動作的影格播放速度。
    const animationElapsed = frameCount - actor.actionStartedAt; // 計算目前動作已播放的畫格數。
    const actionDuration = actor.action === "attack" ? actor.attackDuration : actor.jumpDuration; // 讀取跳躍或攻擊動作的完整播放時間。
    const actionProgress = constrain(animationElapsed / actionDuration, 0, 0.999); // 計算跳躍或攻擊動畫進度。
    const oneShotAction = actor.action === "jump" || actor.action === "attack"; // 判斷目前是否為單次播放動作。
    const frameIndex = oneShotAction ? floor(actionProgress * frames.length) : floor(animationElapsed / frameInterval) % frames.length; // 計算目前要顯示的影格。
    const frame = frames[frameIndex]; // 取得目前動作動畫影格。
    const characterWidth = frame.width * (characterHeight / frame.height); // 依照原始圖片比例計算角色寬度。
    const idleBob = actor.airborne ? 0 : sin(frameCount * 0.06 + index * PI) * 3; // 計算角色待機時的輕微上下浮動。
    const y = characterBaseline() + actor.verticalOffset + idleBob; // 設定角色地面位置與跳躍高度。
    push(); // 暫存畫布狀態以便翻轉右側角色。
    translate(actor.x, y); // 將座標原點移至目前角色中心。
    scale(actor.facing, 1); // 依照角色移動方向鏡像精靈圖。
    image(frame, 0, 0, characterWidth, characterHeight); // 以相同高度繪製角色影格。
    pop(); // 還原畫布狀態以免影響其他繪圖。
  } // 結束角色繪製。
} // 結束角色動畫函式。

// 繪製左右角色各自不同顏色與造型的攻擊閃光。
function drawAttackEffects() { // 在攻擊期間更新並繪製閃光特效。
  const characterHeight = min(height * 0.4, width * 0.23, 260); // 計算角色共用顯示高度。
  for (let index = 0; index < actors.length; index += 1) { // 逐一檢查兩位角色的攻擊狀態。
    const actor = actors[index]; // 讀取目前角色的遊戲狀態。
    if (!actor.attackActive) { // 角色沒有正在攻擊時。
      continue; // 略過目前角色的特效繪製。
    } // 結束攻擊狀態判斷。
    const progress = constrain((frameCount - actor.attackStartedAt) / actor.attackDuration, 0, 1); // 計算攻擊特效淡出進度。
    const pulse = 0.78 + sin(progress * PI * 6) * 0.22; // 計算特效閃爍脈動。
    const flashSize = characterHeight * (0.62 + pulse * 0.22); // 計算特效目前尺寸。
    const opacity = 255 * (1 - progress); // 計算特效目前透明度。
    const flashX = actor.x + actor.facing * characterHeight * 0.38; // 將特效放在角色攻擊方向前方。
    const flashY = characterBaseline() + actor.verticalOffset - characterHeight * 0.18; // 將特效放在角色身體前方。
    push(); // 暫存畫布狀態以設定特效方向。
    translate(flashX, flashY); // 將座標原點移至攻擊特效中心。
    scale(actor.facing, 1); // 讓攻擊特效朝向角色面對的方向。
    if (index === 0) { // 左側角色攻擊時使用青藍色星芒閃光。
      noStroke(); // 移除星芒閃光的邊框。
      fill(72, 238, 255, opacity); // 設定青藍色星芒外層顏色。
      beginShape(); // 開始繪製四角星芒。
      vertex(0, -flashSize * 0.62); // 設定星芒上端。
      vertex(flashSize * 0.1, -flashSize * 0.1); // 設定星芒右上內凹點。
      vertex(flashSize * 0.55, 0); // 設定星芒右端。
      vertex(flashSize * 0.1, flashSize * 0.1); // 設定星芒右下內凹點。
      vertex(0, flashSize * 0.62); // 設定星芒下端。
      vertex(-flashSize * 0.1, flashSize * 0.1); // 設定星芒左下內凹點。
      vertex(-flashSize * 0.55, 0); // 設定星芒左端。
      vertex(-flashSize * 0.1, -flashSize * 0.1); // 設定星芒左上內凹點。
      endShape(CLOSE); // 完成青藍色四角星芒。
      stroke(190, 255, 255, opacity); // 設定星芒周圍的亮色光線。
      strokeWeight(max(2, characterHeight * 0.012)); // 設定星芒光線粗細。
      line(-flashSize * 0.72, -flashSize * 0.42, -flashSize * 0.48, -flashSize * 0.28); // 繪製左上方閃光線。
      line(flashSize * 0.5, flashSize * 0.3, flashSize * 0.73, flashSize * 0.42); // 繪製右下方閃光線。
      noStroke(); // 移除星芒中心的邊框。
      fill(220, 255, 255, opacity); // 設定星芒中心的青白色亮光。
      circle(0, 0, flashSize * 0.16); // 繪製青藍色星芒中心亮點。
    } else { // 右側角色攻擊時使用金橘色星芒閃光。
      noStroke(); // 移除星芒閃光的邊框。
      fill(255, 165, 48, opacity); // 設定金橘色星芒閃光。
      beginShape(); // 開始繪製金橘色星芒。
      vertex(-flashSize * 0.18, -flashSize * 0.58); // 設定星芒上端。
      vertex(flashSize * 0.02, -flashSize * 0.14); // 設定星芒右上內凹點。
      vertex(flashSize * 0.48, -flashSize * 0.32); // 設定星芒右上端。
      vertex(flashSize * 0.17, flashSize * 0.02); // 設定星芒右側內凹點。
      vertex(flashSize * 0.56, flashSize * 0.25); // 設定星芒右端。
      vertex(flashSize * 0.1, flashSize * 0.2); // 設定星芒右下內凹點。
      vertex(-flashSize * 0.04, flashSize * 0.58); // 設定星芒下端。
      vertex(-flashSize * 0.18, flashSize * 0.16); // 設定星芒左下內凹點。
      vertex(-flashSize * 0.55, flashSize * 0.31); // 設定星芒左端。
      vertex(-flashSize * 0.2, -flashSize * 0.08); // 設定星芒左上內凹點。
      endShape(CLOSE); // 完成金橘色星芒。
      fill(255, 244, 181, opacity); // 設定星芒中心的亮黃色。
      circle(0, 0, flashSize * 0.2); // 繪製金黃色閃光中心亮點。
    } // 結束角色特效造型判斷。
    pop(); // 還原畫布狀態以免影響其他繪圖。
  } // 結束角色攻擊特效繪製。
} // 結束攻擊閃光特效函式。

// 繪製含有兩位角色按鍵圖示的半透明頁尾。
function drawControlFooter() { // 在畫布最下方配置角色操作面板。
  const footerHeight = constrain(height * 0.16, 84, 126); // 依照畫布高度設定頁尾高度。
  const footerTop = height - footerHeight; // 計算頁尾上緣位置。
  const outerPadding = 8; // 設定頁尾外側留白。
  const panelGap = 8; // 設定兩個角色面板之間的間距。
  const panelWidth = (width - outerPadding * 2 - panelGap) / 2; // 計算左右操作面板寬度。
  noStroke(); // 移除頁尾背景外框。
  fill(8, 20, 30, 218); // 設定半透明深色頁尾背景。
  rect(0, footerTop, width, footerHeight); // 繪製貼齊畫布底部的頁尾背景。
  stroke(116, 190, 185, 180); // 設定頁尾上緣的柔和分隔線。
  strokeWeight(1); // 設定頁尾分隔線粗細。
  line(0, footerTop, width, footerTop); // 繪製頁尾上緣分隔線。
  drawControlPanel(outerPadding, footerTop + 5, panelWidth, footerHeight - 10, 0); // 繪製左側角色操作說明。
  drawControlPanel(outerPadding + panelWidth + panelGap, footerTop + 5, panelWidth, footerHeight - 10, 1); // 繪製右側角色操作說明。
} // 結束頁尾繪製函式。

// 計算可避開頁尾並讓角色保持在畫面中的地面高度。
function characterBaseline() { // 回傳角色的地面垂直位置。
  const characterHeight = min(height * 0.4, width * 0.23, 260); // 計算角色共用顯示高度。
  const footerHeight = constrain(height * 0.16, 84, 126); // 計算底部操作頁尾高度。
  return min(height * 0.72, height - footerHeight - characterHeight / 2 - 8); // 需要時將角色往上移以免被頁尾遮住。
} // 結束角色地面高度計算函式。

// 繪製一位角色的操作面板與按鍵圖示。
function drawControlPanel(x, y, panelWidth, panelHeight, actorIndex) { // 根據角色編號繪製控制說明。
  const compact = width < 600; // 判斷是否使用較緊湊的手機版排版。
  const titleSize = compact ? 10 : 12; // 設定面板標題字級。
  const labelSize = compact ? 8 : 10; // 設定動作標籤字級。
  const keySize = constrain(panelWidth * 0.034, 8, 11); // 設定按鍵圖示字級。
  const headerHeight = compact ? 15 : 17; // 設定標題區高度。
  const rowHeight = (panelHeight - headerHeight) / 4; // 計算四列操作說明的高度。
  const controlRows = actorIndex === 0 ? [ // 依照角色編號選擇操作按鍵。
    { label: "走", combos: ["Z ←", "C →"] }, // 設定左側角色走路按鍵。
    { label: "跳", combos: ["S ↑", "S+Z ↖", "S+C ↗"] }, // 設定左側角色跳躍按鍵。
    { label: "跑", combos: ["Z+X ←", "C+X →"] }, // 設定左側角色跑步按鍵。
    { label: "攻", combos: ["Space+Z ←", "Space+C →"] }, // 設定左側角色攻擊按鍵。
  ] : [ // 設定右側角色的操作按鍵。
    { label: "走", combos: ["←", "→"] }, // 設定右側角色走路按鍵。
    { label: "跳", combos: ["↑", "←+↑ ↖", "→+↑ ↗"] }, // 設定右側角色跳躍按鍵。
    { label: "跑", combos: ["←+↓", "→+↓"] }, // 設定右側角色跑步按鍵。
    { label: "攻", combos: ["Space+←", "Space+→"] }, // 設定右側角色攻擊按鍵。
  ]; // 完成目前角色操作按鍵清單。
  noStroke(); // 移除操作面板外框。
  fill(15, 37, 45, 205); // 設定操作面板底色。
  rect(x, y, panelWidth, panelHeight, 8); // 繪製圓角操作面板。
  fill(225, 246, 235); // 設定面板標題文字顏色。
  textSize(titleSize); // 設定面板標題字級。
  textAlign(LEFT, CENTER); // 將面板標題靠左垂直置中。
  text(actorIndex === 0 ? "角色 1（左）" : "角色 2（右）", x + 8, y + headerHeight / 2); // 顯示目前角色名稱。
  stroke(100, 155, 160, 150); // 設定標題與操作列的分隔線顏色。
  strokeWeight(1); // 設定面板分隔線粗細。
  line(x + 7, y + headerHeight, x + panelWidth - 7, y + headerHeight); // 繪製面板標題分隔線。
  for (let rowIndex = 0; rowIndex < controlRows.length; rowIndex += 1) { // 逐列繪製走、跳、跑與攻擊方式。
    const row = controlRows[rowIndex]; // 讀取目前的動作操作資料。
    const rowY = y + headerHeight + rowHeight * (rowIndex + 0.5); // 計算目前操作列的垂直中心。
    const keyHeight = max(11, rowHeight - 4); // 設定按鍵圖示高度。
    let keyX = x + (compact ? 27 : 33); // 設定按鍵圖示起始位置。
    noStroke(); // 移除動作標籤外框。
    fill(185, 216, 210); // 設定動作標籤文字顏色。
    textSize(labelSize); // 設定動作標籤字級。
    textAlign(LEFT, CENTER); // 將動作標籤靠左垂直置中。
    text(row.label, x + 9, rowY); // 顯示目前動作名稱。
    textSize(keySize); // 設定按鍵圖示文字大小。
    for (let combo of row.combos) { // 逐一繪製目前動作的按鍵組合。
      const keyWidth = max(keyHeight + 4, textWidth(combo) + 10); // 依照按鍵文字長度計算圖示寬度。
      if (keyX + keyWidth > x + panelWidth - 6) { // 按鍵組合超出面板時。
        break; // 停止繪製以避免超出操作面板。
      } // 結束面板寬度檢查。
      drawKeyIcon(combo, keyX, rowY - keyHeight / 2, keyWidth, keyHeight, keySize); // 繪製目前的按鍵圖示。
      keyX += keyWidth + 4; // 移至下一個按鍵圖示的位置。
    } // 結束目前列的按鍵組合繪製。
  } // 結束操作列繪製。
} // 結束操作面板繪製函式。

// 以圓角按鍵造型繪製操作圖示。
function drawKeyIcon(label, x, y, iconWidth, iconHeight, fontSize) { // 繪製單一按鍵或按鍵組合。
  stroke(176, 218, 210, 220); // 設定按鍵圖示外框顏色。
  strokeWeight(1); // 設定按鍵圖示外框粗細。
  fill(35, 63, 70, 245); // 設定按鍵圖示底色。
  rect(x, y, iconWidth, iconHeight, 4); // 繪製圓角按鍵圖示。
  noStroke(); // 移除按鍵文字外框。
  fill(242, 250, 239); // 設定按鍵文字顏色。
  textSize(fontSize); // 設定按鍵文字大小。
  textAlign(CENTER, CENTER); // 將按鍵文字水平與垂直置中。
  text(label, x + iconWidth / 2, y + iconHeight / 2); // 在按鍵圖示中央顯示按鍵內容。
} // 結束按鍵圖示繪製函式。

// 視窗尺寸改變時同步調整畫布與森林配置。
function windowResized() { // 處理瀏覽器視窗尺寸變更。
  resizeCanvas(windowWidth, windowHeight); // 將畫布調整為新的視窗大小。
  const characterHeight = min(height * 0.4, width * 0.23, 260); // 重新計算角色共用顯示高度。
  actors[0].x = width / 2 - characterHeight * 0.55; // 將左側角色放回畫面中央左方。
  actors[1].x = width / 2 + characterHeight * 0.55; // 將右側角色放回畫面中央右方。
  createForest(); // 依照新畫面尺寸重新配置樹木。
  createFireflies(); // 依照新畫面尺寸重新配置螢火蟲。
} // 結束視窗尺寸變更函式。
