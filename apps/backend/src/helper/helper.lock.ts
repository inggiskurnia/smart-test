import { Mutex } from "async-mutex";

const vehicleMutexMap = new Map<string, Mutex>();

const inventoryIpaMutexMap = new Map<string, Mutex>();

export function getVehicleMutex(vehicleId: string): Mutex {
    if (!vehicleMutexMap.has(vehicleId)) {
        vehicleMutexMap.set(vehicleId, new Mutex());
    }
    return vehicleMutexMap.get(vehicleId)!;
}

export function getInventoryIpalMutex(materialCode: string): Mutex {
    if (!inventoryIpaMutexMap.has(materialCode)) {
        inventoryIpaMutexMap.set(materialCode, new Mutex());
    }
    return inventoryIpaMutexMap.get(materialCode)!;
}

export function getInventoryIpaMutex(materialCode: string): Mutex {
    if (!inventoryIpaMutexMap.has(materialCode)) {
        inventoryIpaMutexMap.set(materialCode, new Mutex());
    }
    return inventoryIpaMutexMap.get(materialCode)!;
}