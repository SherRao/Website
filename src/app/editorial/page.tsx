import {
    EditorialHero,
    EditorialBuilder,
    EditorialConnector,
    EditorialCreative,
    EditorialContact,
    EditorialFooter,
} from "@/sections/editorial";
import { VariantBody } from "@/components/editorial/VariantBody";
import { VariantNav } from "@/components/shared/VariantNav";
import { BackgroundBlob } from "@/components/shared/BackgroundBlob";

export default function EditorialPage() {
    return (
        <>
            <VariantBody variant="editorial" />
            <VariantNav tone="dark" />
            <BackgroundBlob size={600} opacity={40} blur={250} />

            <main className="relative w-full">
                <EditorialHero />
                <EditorialBuilder />
                <EditorialConnector />
                <EditorialCreative />
                <EditorialContact />
                <EditorialFooter />
            </main>
        </>
    );
}
