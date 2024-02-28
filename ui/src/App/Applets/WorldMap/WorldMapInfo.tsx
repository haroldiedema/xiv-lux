/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { Raycaster, RaycasterCandidate } from "@/App/Applets/WorldMap/Interaction/Raycaster";
import { AbstractComponent, Attribute, Inject, UIComponent } from "@/System/Interface";
import { Socket } from "@/System/Socket";
import { Emote, Item, Quest, SkillAction } from "@/XIV/Models/Generated";

@UIComponent('xiv-world-map-info', '/css/applets/xiv-world-map-info.css')
export class WorldMapInfo extends AbstractComponent
{
    @Attribute public x: number;
    @Attribute public anchor: string = 'left';
    @Attribute public height: number = 100;

    @Inject private readonly raycaster: Raycaster;
    @Inject private readonly socket: Socket;

    private raf: number = null;
    private hit: RaycasterCandidate = null;

    private itemRewards: Item[] = [];
    private optionalItemRewards: Item[] = [];
    private gilReward: number = 0;
    private emoteReward: Emote = null;
    private actionReward: SkillAction = null;

    public onMounted(): void
    {
        cancelAnimationFrame(this.raf);
        this.update();
    }

    public onDisposed(): void
    {
        cancelAnimationFrame(this.raf);
    }

    public render()
    {
        if (! this.hit || !this.hit?.metadata?.quest) {
            return <ui:host class="hidden"/>;
        }

        const quest = this.hit.metadata.quest as Quest;
        const iconId = this.hit.metadata.iconId;
        const jobIconId = quest.requiredJobId ? quest.requiredJobId + 62000 : 61696;
        const bannerImg = quest.bannerImage ? `url('${this.socket.httpAddress}/image/icon/${quest.bannerImage}.png')` : 'none';

        return (
            <ui:host
                class={`visible anchor-${this.anchor}`}
                style={{
                    right: this.anchor === 'left' ? `${this.x}px` : 'unset', 
                    left: this.anchor === 'right' ? `${this.x}px` : 'unset',
                    maxHeight: `${this.height}px`
                }}
            >
                <header style={{'--bg': bannerImg}}>
                    <img src={`${this.socket.httpAddress}/image/icon/${iconId}-hr.png`}/>
                    <div>
                        <h1>{quest.name}</h1>
                        <div>
                            <img src={`${this.socket.httpAddress}/image/icon/${jobIconId}.png`} style={{width: jobIconId === 61696 ? '0' : '32px'}}/>
                            <span>{quest.requiredJobCategory}</span>
                            <span>{quest.requiredJobLevel > 1 ? `Lv. ${quest.requiredJobLevel}` : 'All levels'}</span>
                        </div>
                    </div>
                </header>
                <main>
                    {this.gilReward > 0 && (
                        <div class="reward-card">
                            <div class="title">Gil reward</div>
                            <xiv-icon icon={65002} size={32}/>
                            <span class="currency-amount">{this.gilReward}</span>
                        </div>
                    )}
                    {this.actionReward && (
                        <div class="reward-card">
                            <div class="title">Action reward</div>
                            <xiv-icon icon={this.actionReward.iconId} size={32}/>
                            <div>
                                <div class="item-name">{this.actionReward.name}</div>
                                <div class="item-cat">{this.actionReward.category}</div>
                            </div>
                        </div>
                    )}
                    {this.emoteReward && (
                        <div class="reward-card">
                            <div class="title">Emote reward</div>
                            <xiv-icon icon={this.emoteReward.iconId} size={32}/>
                            <div>
                                <div class="item-name">{this.emoteReward.name}</div>
                                <div class="item-cat">Emote</div>
                            </div>
                        </div>
                    )}
                </main>
                <main>
                {this.itemRewards.length > 0 && (
                        <div class="reward-card list">
                            <div class="title">Item rewards</div>
                            {this.itemRewards.map(item => (
                                <div class="item">
                                    <xiv-icon icon={item.iconId} size={32}/>
                                    <div>
                                        <div class="item-name">{item.name}</div>
                                        <div class="item-cat">{item.categoryName}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                )}
                {this.optionalItemRewards.length > 0 && (
                        <div class="reward-card list">
                            <div class="title">Optional item rewards</div>
                            {this.optionalItemRewards.map(item => (
                                <div class="item">
                                    <xiv-icon icon={item.iconId} size={32}/>
                                    <div>
                                        <div class="item-name">{item.name}</div>
                                        <div class="item-cat">{item.categoryName}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                )}
                </main>
            </ui:host>
        )
    }

    private update(): void
    {
        this.hit = this.raycaster.hitCandidate;
        this.raf = requestAnimationFrame(() => this.update());

        if (this.hit && this.hit.metadata.quest) {
            const quest = this.hit.metadata.quest as Quest;

            this.gilReward = quest.rewards.gil;
            this.itemRewards = quest.rewards.items;
            this.optionalItemRewards = quest.rewards.optionalItems;
            this.emoteReward = quest.rewards.emote;
            this.actionReward = quest.rewards.action;
        } else {
            this.gilReward = 0;
            this.itemRewards = [];
            this.optionalItemRewards = [];
            this.emoteReward = null;
            this.actionReward = null;
        }
    }
}
