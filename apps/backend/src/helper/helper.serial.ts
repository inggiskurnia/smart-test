export class Serial {
    private static TENANT = "T";
    private static RECEIVE_IPAL = "R-IPAL";
    private static CONSUMPTION_IPAL = "C-IPAL";
    private static RECEIVE_IPA = "R-IPA";
    private static CONSUMPTION_IPA = "C-IPA";
    private static STOCK_ADJUSTMENT_IPA = "SA-IPA";
    private static STOCK_ADJUSTMENT_IPAL = "SA-IPAL";

    private static WIDTH = 8;
    private static pad(n: number, w = Serial.WIDTH) {
        return String(n).padStart(w, "0");
    }

    public static generateSerialTenant(seq: number): string {
        return `${Serial.TENANT}-${Serial.pad(seq)}`;
    }

    public static generateSerialReceiveIpal(seq: number): string {
        return `${Serial.RECEIVE_IPAL}-${Serial.pad(seq)}`;
    }

    public static generateSerialConsumptionIpal(seq: number): string {
        return `${Serial.CONSUMPTION_IPAL}-${Serial.pad(seq)}`;
    }

    public static generateSerialReceiveIpa(seq: number): string {
        return `${Serial.RECEIVE_IPA}-${Serial.pad(seq)}`;
    }

    public static generateSerialConsumptionIpa(seq: number): string {
        return `${Serial.CONSUMPTION_IPA}-${Serial.pad(seq)}`;
    }

    public static generateSerialStockAdjustmentIpa(reasonCode: string, seq: number): string {
        return `${Serial.STOCK_ADJUSTMENT_IPA}-${reasonCode}-${Serial.pad(seq)}`;
    }

    public static generateSerialStockAdjustmentIpal(reasonCode: string, seq: number): string {
        return `${Serial.STOCK_ADJUSTMENT_IPAL}-${reasonCode}-${Serial.pad(seq)}`;
    }

    public static parseSequence(code: string): number {
        const parts = code.split("-");
        return parseInt(parts[parts.length - 1], 10);
    }
}