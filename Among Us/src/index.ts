import "frida-il2cpp-bridge";

function start() {
	Il2Cpp.perform(() => {
		//Il2Cpp.dump();


		var img = Il2Cpp.domain.assembly("Assembly-CSharp").image;

		var purchaseData = img.class("PlayerPurchasesData");
		purchaseData.method<boolean>("GetPurchase").implementation = (key, bundle) => {
			console.log(`GetPurchase(${key}, ${bundle})`);
			return true;
		}
	});
}


let waitForLoad = setInterval(() => {
	let il2cpp = Process.findModuleByName("il2cpp.so");
	if (il2cpp === undefined) {
		return;
	}

	clearInterval(waitForLoad);
	start();
	console.log("SLShook Loaded!");
}, 1000);
