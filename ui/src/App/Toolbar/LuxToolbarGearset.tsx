/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent, Inject, UIComponent } from "@/System/Interface";
import { Invoker, Socket } from "@/System/Socket";
import { Bound } from "@/System/Types";
import { PlayerActor } from "@/XIV/Models";
import { Gearset, GearsetState } from "@/XIV/Models/Generated";
import { Job, RoleMap } from "@/XIV/Types";

@UIComponent('lux-toolbar-gearset', '/css/toolbar/lux-toolbar-gearset.css')
export class LuxToolbarGearset extends AbstractComponent
{
    @Inject private readonly socket: Socket;
    @Inject private readonly invoker: Invoker;

    private showPanel: boolean = false;
    private player: PlayerActor = null;
    private gearset: Gearset = null;
    private curIndex: number = 0;
    private changeTimer: number = null;
    private changingGearset: boolean = false;

    private tankSets: Gearset[] = [];
    private healerSets: Gearset[] = [];
    private meleeSets: Gearset[] = [];
    private rangedSets: Gearset[] = [];
    private casterSets: Gearset[] = [];
    private crafterSets: Gearset[] = [];
    private gathererSets: Gearset[] = [];

    /**
     * @inheritdoc
     */
    public override onMounted(): void
    {
        this.socket.subscribe('Gearset', this.onGearsetStateUpdated);
        this.socket.subscribe('PlayerActor', this.onPlayerActorUpdated);
    }

    /**
     * @inheritdoc
     */
    public render()
    {
        if (!this.player || !this.gearset) {
            return <ui:host/>;
        }

        return (
            <ui:host>
                <main class={RoleMap[Job[this.gearset.classJobId]]} on:click={() => this.showPanel = !this.showPanel}>
                    <xiv-icon icon={62000 + this.gearset.classJobId} size={24}/>
                    <div>
                        <div class="name">{this.player.name}</div>
                        <div class="job">Lv. {this.player.level} {this.gearset.name}</div>
                    </div>
                </main>
                <div id="panel-wrapper" class={{'hidden': !this.showPanel}} on:mousedown={(e: MouseEvent) => {
                    if ((e.composedPath()[0] as HTMLElement).id === 'panel-wrapper') {
                        this.showPanel = false;
                    }
                }}>
                    <div id="panel">
                        <section>
                            <header>Diciple of War / Magic</header>
                            <div class="flex-h">
                                <div class="flex-v job-list">
                                    <div class="category"><span>Tank</span></div>
                                    {this.tankSets.map((gs, i) => this.renderGearset(gs))}
                                    <div class="category"><span>Melee DPS</span></div>
                                    {this.meleeSets.map((gs, i) => this.renderGearset(gs))}
                                </div>
                                <div class="flex-v job-list">
                                    <div class="category"><span>Healer</span></div>
                                    {this.healerSets.map((gs, i) => this.renderGearset(gs))}
                                    <div class="category"><span>Caster DPS</span></div>
                                    {this.casterSets.map((gs, i) => this.renderGearset(gs))}
                                    <div class="category"><span>Ranged DPS</span></div>
                                    {this.rangedSets.map((gs, i) => this.renderGearset(gs))}
                                </div>
                            </div>
                        </section>
                        <section>
                            <header>Diciple of the Hand / Land</header>
                            <div class="flex-h">
                                <div class="flex-v job-list">
                                    <div class="category"><span>Gatherer</span></div>
                                    {this.gathererSets.map((gs, i) => this.renderGearset(gs))}
                                    <div class="category"><span>Crafter</span></div>
                                    {this.crafterSets.map((gs, i) => this.renderGearset(gs))}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </ui:host>
        )
    }

    private renderGearset(gs: Gearset)
    {
        return (
            <div class={`job${gs.id === this.curIndex ? ' active' : ''}`} on:click={() => this.changeGearset(gs.id)}>
                <xiv-icon icon={62100 + gs.classJobId} size={32}/>
                <xiv-icon icon={gs.mainHand.iconId} size={32} class="weapon"/>
                <div class="info">
                    <div class="name">{gs.name}<span>{gs.itemLevel}</span></div>
                    <div class="weap">{gs.mainHand.name}</div>
                </div>
            </div>
        )
    }

    @Bound private onGearsetStateUpdated(state: GearsetState): void
    {
        if (! state) {
            this.curIndex = 0;
            this.gearset = null;
            return;
        }

        this.curIndex = state.currentIndex;
        this.gearset = state.gearsets[this.curIndex] ?? null;

        this.tankSets = state.gearsets.filter(gs => RoleMap[Job[gs.classJobId]] === 'tank').sort((a, b) => a.name.localeCompare(b.name));
        this.healerSets = state.gearsets.filter(gs => RoleMap[Job[gs.classJobId]] === 'healer').sort((a, b) => a.name.localeCompare(b.name));
        this.meleeSets = state.gearsets.filter(gs => RoleMap[Job[gs.classJobId]] === 'melee-dps').sort((a, b) => a.name.localeCompare(b.name));
        this.rangedSets = state.gearsets.filter(gs => RoleMap[Job[gs.classJobId]] === 'ranged-dps').sort((a, b) => a.name.localeCompare(b.name));
        this.casterSets = state.gearsets.filter(gs => RoleMap[Job[gs.classJobId]] === 'caster-dps').sort((a, b) => a.name.localeCompare(b.name));
        this.crafterSets = state.gearsets.filter(gs => RoleMap[Job[gs.classJobId]] === 'crafter').sort((a, b) => a.name.localeCompare(b.name));
        this.gathererSets = state.gearsets.filter(gs => RoleMap[Job[gs.classJobId]] === 'gatherer').sort((a, b) => a.name.localeCompare(b.name));
    }

    @Bound private onPlayerActorUpdated(player: PlayerActor): void
    {
        this.player = player;
    }

    private changeGearset(index: number): void
    {
        clearTimeout(this.changeTimer);

        if (this.changingGearset) {
            console.warn('Already changing gearset.');
            return;
        }

        this.changingGearset = true;
        this.showPanel = false;
        
        this.changeTimer = setTimeout(() => {
            this.invoker.gearset.setCurrentGearset(index);
        
            this.changeTimer = setTimeout(() => {
                this.invoker.chat.send(Math.random() < 0.51 ? '/bstance' : '/vpose');
                this.changingGearset = false;
            }, 100);
        }, 50);
    }
}
