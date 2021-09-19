import InMemoryStore from "./in-memory.store";

describe("InMemoryStore test", ()=>{
    test("Send to cache, and receive stringified object", async ()=>{
        let store = new InMemoryStore();

        let resp = await store.sendToCache<number>("myNumber", 69)
        expect(resp).toBe((69).toString())
    })

    test("Send to cache, then obtain via key", async ()=>{
        let store = new InMemoryStore();

        let sendResp = await store.sendToCache<number>("myNumber", 122);
        let readResp = await store.readFromCache<number>("myNumber")

        expect(sendResp).toBe((122).toString())
        expect(readResp).toBe(122);
    })

    test("Send to cache, then remove via key", async()=>{
        let store = new InMemoryStore();
        await store.sendToCache<number>("myNumber", 420);

        expect(store.memory.filter((kv)=>kv.key === "myNumber").length).toBe(1);
        let resp = await store.removeKey("myNumber");
        expect(store.memory.filter((kv)=>kv.key === "myNumber").length).toBe(0);
        expect(resp).toBe(1);
    })
    test("Try to remove key which does not exist", async()=>{
        let store = new InMemoryStore();
        let resp  = await store.removeKey("Key");
        expect(resp).toBe(0);
    })

    test("Update already existing key with new value", async()=>{
        let store = new InMemoryStore();
        let resp = await store.sendToCache<number>("MyNumber", 1);
        expect(resp).toBe((1).toString());

        resp = await store.sendToCache<number>("MyNumber", 2);
        expect(resp).toBe((2).toString());
    })

    test("Try to read non existend key from cache", async()=>{
        let store = new InMemoryStore();

        let catched = false;
        try{
            await store.readFromCache<number>("myNumber");
        }
        catch(e)
        {
            catched = true;

        }
        expect(catched).toBe(true);
    })
})