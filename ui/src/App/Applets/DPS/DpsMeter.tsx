/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractApplet, Applet } from "@/System/Applet";
import { EventSubscriber } from "@/System/Event";
import { Inject } from "@/System/Interface";
import { ActorManager } from "@/XIV/ActorManager";
import { EncounterParser } from "@/XIV/Encounter/EncounterParser";
import { EncounterParticipant } from "@/XIV/Encounter/EncounterParticipant";

@Applet('xiv-dps-meter', {
    name: 'DPS Meter',
    icon: 'chart-line',
    styleUrl: '/css/applets/xiv-dps-meter.css',
    isSingleInstance: true,
    isFrameless: true,
    minWidth: 300,
    minHeight: 250,
})
export class DpsMeter extends AbstractApplet
{
    @Inject private readonly ep: EncounterParser;
    @Inject private readonly actors: ActorManager;

    private eventSubscriber: EventSubscriber<any> = null;
    private participants: EncounterParticipant[] = [];
    private totalParticipants: number = 0;
    private totalDamage: number = 0;
    private yourPosition: number = 0;

    /**
     * @inheritdoc
     */
    public override onMounted(): void
    {
        this.eventSubscriber = this.ep.on('updated', p => {
            this.totalParticipants = p.length;
            this.participants = p.slice(0, 8);
            this.yourPosition = p.find(p => p.actor.id === this.actors.player.id)?.position ?? 0;
            this.totalDamage = p.reduce((a, b) => a + b.totalDamage, 0);
        });
    }

    public override onDisposed(): void
    {
        this.eventSubscriber.unsubscribe();    
    }

    /**
     * @inheritdoc
     */
    public render()
    {
        if (this.participants.length === 0) {
            return (
                <ui:host>
                    <main ui-key="inactive">
                        <div>No encounter data available.</div>
                    </main>
                </ui:host>
            );
        }

        return (
            <ui:host>
                <main ui-key="active">
                    {this.participants.map((p: EncounterParticipant) => (
                        <div class="participant">
                            <div class="background" style={{width: p.percentage + '%'}}/>
                            <div class="foreground">
                                <div class="name">
                                    <xiv-icon icon={62000 + p.actor.jobId} size={24}/>
                                    #{p.position} {p.actor.name}
                                </div>
                                <div class="dps">
                                    <div>
                                        <div>{p.dps.toLocaleString('nl')}</div>
                                        <div>{p.totalDamage.toLocaleString('nl')}</div>
                                    </div>
                                    <div>{p.percentage}%</div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <footer>
                        You are ranked #{this.yourPosition} out of {this.totalParticipants}. Total damage: {this.totalDamage.toLocaleString('nl')}
                    </footer>
                </main>
            </ui:host>
        )
    }
}