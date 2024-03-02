/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent, Inject, UIComponent } from "@/System/Interface";
import { Invoker, Socket } from "@/System/Socket";
import { Bound } from "@/System/Types";
import { CompanionCommand, CompanionState } from "@/XIV/Models/Generated";

@UIComponent('lux-toolbar-companion', '/css/toolbar/lux-toolbar-companion.css')
export class LuxToolbarGearset extends AbstractComponent
{
    @Inject private readonly socket: Socket;
    @Inject private readonly invoker: Invoker;

    private showPanel: boolean = false;
    private companion: CompanionState = null;
    private xpPercent: number = 0;
    private summoning: boolean = false;

    /**
     * @inheritdoc
     */
    public override onMounted(): void
    {
        this.socket.subscribe('CompanionState', this.onCompanionStateUpdated);
    }

    /**
     * @inheritdoc
     */
    public render()
    {
        if (! this.companion) {
            return <ui:host/>;
        }

        if (this.companion.timeLeft > 0) {
            return (
                <ui:host>
                    <main 
                        ui-key="active"
                        on:click={() => this.showPanel = !this.showPanel} 
                    >
                        <xiv-icon icon={this.companion.iconId} size={20}/>
                        <div>
                            <div class="name">
                                {this.companion.name}
                                {this.xpPercent > 99 && this.companion.level < 20 ? ' (LEVEL UP)' : ''}
                            </div>
                            <div class="info">{this.secondsToMMSS(this.companion.timeLeft)}</div>
                        </div>
                    </main>
                    <div 
                        ui-key="panel"
                        id="panel-wrapper"
                        on:click={(e) => e.composedPath()[0]?.id === 'panel-wrapper' && (this.showPanel = false)}
                        class={{hidden: !this.showPanel}}
                    >
                        <div id="panel">
                            <div class="header">
                                <div class="name">{this.companion.name}</div>
                                <div class="info">
                                    <div>Lv. {this.companion.level}, {this.commandName}</div>
                                    <div class="xp">
                                        <div class="current">{this.companion.currentXP.toLocaleString('nl')}</div>
                                        <span>/</span>
                                        <div class="max">{this.companion.maxXP.toLocaleString('nl')}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="progress">
                                <div class="bar" style={{width: `${this.xpPercent}%`}}/>
                            </div>

                            <div class="time-left">
                                <div>
                                    <div class="label">Time Left</div>
                                    <div class="value">{this.secondsToMMSS(this.companion.timeLeft)}</div>
                                </div>
                                <div>
                                    <button class={{large: true, disabled: !this.companion.canSummon || this.summoning || this.minutesToAdd < 1}} on:click={() => this.useGrysahlGreens()}>
                                        <xiv-icon icon={25218} size={24}/>
                                        <span>{!this.companion.canSummon ? 'No Grysahl Greens' : `Add ${this.minutesToAdd} minutes`}</span>
                                    </button>
                                </div>
                            </div>

                            <div class="actions">
                                {this.drawStanceButton(CompanionCommand.Follow, 'Follow')}
                                {this.drawStanceButton(CompanionCommand.FreeStance, 'Free Stance')}
                                {this.drawStanceButton(CompanionCommand.AttackerStance, 'Attacker')}
                                {this.drawStanceButton(CompanionCommand.DefenderStance, 'Defender')}
                                {this.drawStanceButton(CompanionCommand.HealerStance, 'Healer')}
                            </div>

                            <footer>
                                <button class="ghost" on:click={() => this.invoker.companion.setCommand(2)}>
                                    Withdraw from battlefield
                                    <xiv-icon icon={901} size={24}/>
                                </button>
                            </footer>
                        </div>
                    </div>
                </ui:host>
            );
        }

        return (
            <ui:host>
                <main 
                    ui-key="inactive"
                    on:click={() => this.useGrysahlGreens()} 
                    class={{
                        unavailable: !this.companion.canSummon
                    }}
                >
                    <xiv-icon icon={this.companion.iconId} size={20}/>
                    <div>
                        <div class="name">{this.companion.name}</div>
                        <div class="info">Lv. {this.companion.level}</div>
                    </div>
                </main>
            </ui:host>
        );
    }

    private drawStanceButton(command: CompanionCommand, label: string)
    {
        return (
            <button 
                class={{stance: true, large: true, active: this.companion.command === command}}
                on:click={() => this.invoker.companion.setCommand(command)}
            >
                <xiv-icon icon={this.getCommandIcon(command)} size={24}/>
                {label}
            </button>
        );
    }

    private get commandName(): string
    {
        switch (this.companion.command) {
            case CompanionCommand.Unknown: return 'Unknown';
            case CompanionCommand.Follow: return 'Loyal follower';
            case CompanionCommand.FreeStance: return 'Free Roamer';
            case CompanionCommand.AttackerStance: return 'Attacker';
            case CompanionCommand.DefenderStance: return 'Defender';
            case CompanionCommand.HealerStance: return 'Healer';
        }
    }

    private getCommandIcon(command: CompanionCommand): number
    {
        switch (command) {
            case CompanionCommand.Unknown: return 0;
            case CompanionCommand.Follow: return 902;
            case CompanionCommand.FreeStance: return 906;
            case CompanionCommand.AttackerStance: return 904;
            case CompanionCommand.DefenderStance: return 903;
            case CompanionCommand.HealerStance: return 905;
        }
    }

    @Bound private onCompanionStateUpdated(state: CompanionState): void
    {
        if (! state) {
            this.showPanel = false;
            this.companion = null;
            this.xpPercent = 0;
            return;
        }

        this.companion = state;
        this.xpPercent = Math.round((state.currentXP / state.maxXP) * 100);
    }

    private useGrysahlGreens(): void
    {
        if (this.summoning) {
            return;
        }

        this.summoning = true;
        this.invoker.companion.summon();
        setTimeout(() => this.summoning = false, 2000);
    }

    private secondsToMMSS(seconds: number): string
    {
        seconds = Math.floor(seconds);

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds - (minutes * 60);

        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    private secondsToMinutes(seconds: number): number
    {
        return Math.floor(seconds / 60);
    }

    private get minutesToAdd(): number
    {
        return this.secondsToMinutes(Math.min(1800, 3600 - this.companion.timeLeft));
    }
}