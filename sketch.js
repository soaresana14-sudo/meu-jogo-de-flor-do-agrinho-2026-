let coins = 150;
let flowers = [];
let particles = [];

const flowerTypes = [
    { name: "Margarida", cost: 50, production: 8, color: "#fff", size: 28, emoji: "🌼" },
    { name: "Girassol", cost: 180, production: 25, color: "#fcd34d", size: 35, emoji: "🌻" },
    { name: "Rosa Rosa", cost: 600, production: 80, color: "#f472b6", size: 38, emoji: "🌹" },
    { name: "Lírio Roxo", cost: 2500, production: 280, color: "#c084fc", size: 42, emoji: "🌺" },
    { name: "Orquídea Dourada", cost: 12000, production: 950, color: "#fbbf24", size: 48, emoji: "🌸" }
];

function setup() {
    createCanvas(900, 600);
    textAlign(CENTER, CENTER);
    
    // Flores iniciais
    for (let i = 0; i < 4; i++) {
        flowers.push({
            x: random(100, width - 280),
            y: random(180, height - 100),
            type: i % 2,
            age: random(100)
        });
    }
}

function draw() {
    background(10, 40, 25);
    
    // Céu
    fill(30, 80, 120);
    rect(0, 0, width, 160);
    
    // Sol
    fill(251, 191, 36);
    circle(width - 130, 90, 75);
    
    // Grama
    fill(22, 101, 52);
    rect(0, 150, width, height - 150);
    
    // Nuvens
    fill(255, 255, 255, 70);
    cloud(160, 65, 1.1);
    cloud(480, 50, 0.9);
    cloud(720, 85, 1.3);
    
    // Produção automática por segundo
    if (frameCount % 60 === 0) {
        coins += Math.floor(calculateProduction());
    }
    
    // Desenhar flores
    for (let flower of flowers) {
        drawFlower(flower);
    }
    
    // Partículas de pólen
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.alpha -= 5;
        p.y -= 1.8;
        if (p.alpha <= 0) {
            particles.splice(i, 1);
        } else {
            fill(255, 240, 100, p.alpha);
            circle(p.x, p.y, p.size);
        }
    }
    
    drawShop();
    updateHUD();
}

// ==================== FUNÇÕES AUXILIARES ====================

function drawFlower(f) {
    let type = flowerTypes[f.type];
    let sway = sin(frameCount * 0.06 + f.age) * 5;
    
    // Caule
    stroke(34, 139, 34);
    strokeWeight(7);
    line(f.x + sway/2, f.y + 20, f.x, f.y + 75);
    
    push();
    translate(f.x + sway, f.y);
    
    // Pétalas
    fill(type.color);
    noStroke();
    for (let i = 0; i < 8; i++) {
        let ang = i * PI / 4;
        let px = cos(ang) * type.size * 0.75;
        let py = sin(ang) * type.size * 0.75;
        ellipse(px, py, type.size * 0.95, type.size * 1.35);
    }
    
    // Centro
    fill(245, 180, 40);
    circle(0, 0, type.size * 0.7);
    
    textSize(type.size * 1.15);
    text(type.emoji, 0, 5);
    pop();
}

function cloud(x, y, s) {
    push();
    translate(x, y);
    scale(s);
    noStroke();
    ellipse(0, 0, 95, 58);
    ellipse(-38, -12, 65, 52);
    ellipse(38, -10, 70, 50);
    pop();
}

function drawShop() {
    fill(20, 30, 45, 235);
    rect(width - 230, 10, 220, height - 20, 18);
    
    fill(255);
    textSize(24);
    text("🌸 LOJA DE FLORES", width - 120, 45);
    
    for (let i = 0; i < flowerTypes.length; i++) {
        let type = flowerTypes[i];
        let y = 85 + i * 88;
        let canBuy = coins >= type.cost;
        
        fill(canBuy ? "#4ade80" : "#555");
        rect(width - 205, y, 185, 72, 12);
        
        fill(255);
        textSize(19);
        text(type.emoji + " " + type.name, width - 112, y + 28);
        
        textSize(15);
        text("💰 " + type.cost + " | +" + type.production + "/s", width - 112, y + 52);
    }
}

function updateHUD() {
    // Como estamos no editor, vamos desenhar o HUD também na tela
    fill(255);
    textSize(20);
    text("💰 Moedas: " + Math.floor(coins).toLocaleString('pt-BR'), 140, 35);
    text("🌱 Produção: " + calculateProduction() + "/s", 140, 65);
}

function calculateProduction() {
    let total = 0;
    for (let f of flowers) {
        total += flowerTypes[f.type].production;
    }
    return total;
}

function createPollen(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x + random(-30, 30),
            y: y + random(-20, 20),
            size: random(7, 15),
            alpha: 255
        });
    }
}

function mousePressed() {
    // Comprar na loja
    if (mouseX > width - 230) {
        for (let i = 0; i < flowerTypes.length; i++) {
            let y = 85 + i * 88;
            if (mouseY > y && mouseY < y + 72) {
                if (coins >= flowerTypes[i].cost) {
                    coins -= flowerTypes[i].cost;
                    flowers.push({
                        x: random(80, width - 280),
                        y: random(170, height - 110),
                        type: i,
                        age: random(100)
                    });
                    createPollen(mouseX, mouseY, 18);
                }
                return;
            }
        }
    }
    
    // Colher pólen das flores
    for (let flower of flowers) {
        if (dist(mouseX, mouseY, flower.x, flower.y) < 55) {
            coins += Math.floor(flowerTypes[flower.type].production * 0.7);
            createPollen(flower.x, flower.y - 25, 15);
            return;
        }
    }
}

function keyPressed() {
    if (key === 's' || key === 'S') {
        console.log("💾 Jogo salvo! (use localStorage no HTML completo)");
    }
}