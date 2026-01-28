import "frida-il2cpp-bridge"

const LOGGING = false;

const trace = function() {
	Il2Cpp.trace(false).assemblies(Il2Cpp.domain.assembly("Assembly-CSharp")).filterMethods(m => {
		if (m.name.toLowerCase().includes("power")) {
			//if (m.name.toLowerCase().includes("pickup")) {
			console.log(`Tracing ${m.class.fullName}::${m.name}`);
			return true;
		}

		return false;
	}).and().attach();
	console.log("Tracing!");
}

const log = function(msg: string) {
	if (!LOGGING) {
		return;
	}

	console.log(msg);
}

const start = function() {
	Il2Cpp.perform(() => {
		//Il2Cpp.dump();
		//trace();

		let asm = Il2Cpp.domain.assembly("Assembly-CSharp").image;

		let purchaseModel = asm.class("Assets.Scripts.Models.Profile.PurchaseModel");

		purchaseModel.method<boolean>("HasMadeOneTimePurchase").implementation = function(name) {
			//this.method("AddOneTimePurchaseItem").invoke(name);
			//
			//log(`HasMadeOneTimePurchase(${name})`);
			//
			return true;
		};


		//Ingame collection thingies?
		let lootModel = asm.class("Assets.Scripts.Models.Store.LootSet");

		lootModel.method("AddTrophies").implementation = function(amount) {
			amount = amount as number;

			log(`AddTrophies(${amount})`);

			amount *= 2;
			this.method("AddTrophies").invoke(amount);
		}
		lootModel.method("AddKnowledgePoints").implementation = function(amount) {
			amount = amount as number;

			log(`AddKnowledgePoints(${amount})`);

			amount *= 2;
			this.method("AddKnowledgePoints").invoke(amount);
		}


		let player = asm.class("Assets.Scripts.Unity.Player.Btd6Player");

		player.method("GainMonkeyMoney").implementation = function(amount, from) {
			amount = amount as number;

			log(`GainMonkeyMoney(${amount}, ${from})`);

			amount *= 2;
			this.method("GainMonkeyMoney").invoke(amount, from);
		}

		player.method("GainPlayerXP").implementation = function(amount) {
			amount = amount as number;

			log(`GainPlayerXP(${amount})`);

			amount *= 2;
			this.method("GainPlayerXP").invoke(amount);
		}

		player.method("ConsumePower").implementation = function(powerId, amount) {
			log(`ConsumePower(${powerId}, ${amount})`);
			//this.method("GetPowerUseCount").invoke(powerId, amount);
		}

		player.method("HasUnlockedTowerSkin").implementation = function(skinId) {
			//this.method("HasUnlockedTowerSkin").invoke(skinId);
			log(`HasUnlockedTowerSkin(${skinId})`);
			return true;
		}


		let xpBridge = asm.class("Assets.Scripts.Unity.Bridge.Xp");

		xpBridge.method("AddTowerXp").implementation = function(tower, amount) {
			amount = amount as number;

			log(`AddTowerXp(${tower}, ${amount})`);

			amount *= 2;
			this.method("AddTowerXp").invoke(tower, amount);
		}

		//No worky, errors out on Pickup.invoke();
		//let cashProjectile = asm.class("Assets.Scripts.Simulation.Towers.Projectiles.Behaviors.Cash");
		//let kTower = asm.class("Assets.Scripts.Simulation.Towers.Tower");

		//cashProjectile.method(".ctor").implementation = function() {
		//	this.method(".ctor").invoke();

		//	let n = new Il2Cpp.Pointer(ptr(0), kTower.type);
		//	this.method<number>("Pickup").invoke(n);
		//}
		//cashProjectile.method<number>("Pickup").implementation = function(tower) {
		//	let n = new Il2Cpp.Pointer(ptr(0), kTower.type);
		//	return this.method<number>("Pickup").invoke(n);
		//}
		//

		console.log("SLShook loaded!");
	});
}

let waitForLoad = setInterval(() => {
	if (Process.findModuleByName("GameAssembly.dll") === null) {
		return;
	}

	clearInterval(waitForLoad);
	console.log("Loading...");
	start();
}, 0);
