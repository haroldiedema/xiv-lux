/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractApplet, Applet } from "@/System/Applet";
import { Inject } from "@/System/Interface";
import { Invoker, Socket } from "@/System/Socket";
import { Bound } from "@/System/Types";
import { Emote, Item, QuestMarker, SkillAction, Zone } from "@/XIV/Models/Generated";

@Applet('xiv-quest-rewards-list', {
    name: 'Quest Reward List',
    icon: 'book',
    styleUrl: '/css/applets/xiv-quest-rewards-list.css',
    isSingleInstance: true,
    isFrameless: false,
    minWidth: 600,
    minHeight: 250,
})
export class QuestRewardList extends AbstractApplet
{
    @Inject private readonly socket: Socket;
    @Inject private readonly invoker: Invoker;

    private totalGilReward: number = 0;
    private allMarkers: QuestMarker[] = [];
    private emoteRewards: QuestReward<Emote>[] = [];
    private skillRewards: QuestReward<SkillAction>[] = [];
    private itemRewards: QuestReward<Item>[] = [];
    private zoneId: number = 0;
    private terrId: number = 0;

    /**
     * @inheritdoc
     */
    public override onMounted(): void
    {
        this.socket.subscribe('CurrentZone', this.onCurrentZoneChanged);
        this.socket.subscribe('QuestMarkers', this.onQuestMarkersUpdated);
    }

    /**
     * @inheritdoc
     */
    public render()
    {
        if (this.isEmpty()) {
            return (
                <ui:host>
                    <main class="empty">
                        <div>No quest rewards available in this zone.</div>
                    </main>
                </ui:host>
            );
        }

        return (
            <ui:host>
                <main>
                    {this.totalGilReward > 0 && (
                        <section>
                            <div class="total-gil-reward" key="gil">
                                {this.drawIcon(65002, 32)}
                                <div>
                                    <div>Total gil earned by completion of all quests in this zone:</div>
                                    <div>{this.totalGilReward.toLocaleString('nl')}</div>
                                </div>
                            </div>
                        </section>
                    )}
                    {this.emoteRewards.length > 0 && (
                        <section key="emote">
                            <label>Emote rewards</label>
                            {this.renderEmoteRewards()}
                        </section>
                    )}
                    {this.skillRewards.length > 0 && (
                        <section key="skill">
                            <label>Action rewards</label>
                            {this.renderSkillRewards()}
                        </section>
                    )}
                    {this.itemRewards.length > 0 && (
                        <section key="item">
                            <label>Item rewards</label>
                            {this.renderItemRewards()}
                        </section>
                    )}
                </main>
            </ui:host>
        )
    }

    private isEmpty(): boolean
    {
        return this.totalGilReward === 0 && this.emoteRewards.length === 0 && this.skillRewards.length === 0 && this.itemRewards.length === 0;
    }

    private renderEmoteRewards()
    {
        return this.emoteRewards.map(reward => (
            <div class="reward emote">
                {this.drawIcon(reward.item.iconId, 32)}
                <div class="info">
                    <div class="name">{reward.item.name}</div>
                </div>
                <div class="source">
                    <div><a href="#" on:click={() => this.invoker.zone.setFlagMarker(this.zoneId, this.terrId, reward.marker.position.x, reward.marker.position.y)}>
                        {reward.marker.quest.name}
                    </a></div>
                    <div class="sub">
                        <div>{reward.marker.quest.requiredJobCategory}</div>
                        <div>Lvl.{reward.marker.quest.requiredJobLevel}</div>
                    </div>
                </div>
            </div>
        ));
    }

    private renderSkillRewards()
    {
        return this.skillRewards.map(reward => (
            <div class="reward action">
                {this.drawIcon(reward.item.iconId, 32)}
                <div class="info">
                    <div class="name">{reward.item.name}</div>
                    <div class="sub">
                        <span>{reward.item.category}</span>
                    </div>
                </div>
                <div class="source">
                    <div><a href="#" on:click={() => this.invoker.zone.setFlagMarker(this.zoneId, this.terrId, reward.marker.position.x, reward.marker.position.y)}>
                        {reward.marker.quest.name}
                    </a></div>
                    <div class="sub">
                        <div>{reward.marker.quest.requiredJobCategory}</div>
                        <div>Lvl.{reward.marker.quest.requiredJobLevel}</div>
                    </div>
                </div>
            </div>
        ));
    }

    private renderItemRewards()
    {
        return this.itemRewards.map(reward => (
            <div class="reward item">
                {this.drawIcon(reward.item.iconId, 32)}
                <div class="info">
                    <div class="name">{reward.item.name}</div>
                    <div class="sub">
                        <span>{reward.item.categoryName}</span>
                        <span>{reward.item.jobCategory}</span>
                        <span>Req. lvl: {reward.item.requiredLevel}</span>
                        <span>Item lvl: {reward.item.itemLevel}</span>
                    </div>
                </div>
                <div class="source">
                    <div><a href="#" on:click={() => this.invoker.zone.setFlagMarker(this.zoneId, this.terrId, reward.marker.position.x, reward.marker.position.y)}>
                        {reward.marker.quest.name}
                    </a></div>
                    <div class="sub">
                        <div>{reward.marker.quest.requiredJobCategory}</div>
                        <div>Lvl.{reward.marker.quest.requiredJobLevel}</div>
                    </div>
                </div>
            </div>
        ));
    }

    private drawIcon(iconId: number, size: number)
    {
        return (
            <img src={`${this.socket.httpAddress}/image/icon/${iconId}.png`} style={{
                width: `${size}px`,
                height: `${size}px`,
            }}/>
        );
    }

    @Bound private onCurrentZoneChanged(zone: Zone)
    {
        const name = [zone.placeName];
        if (zone.placeNameSub) {
            name.unshift(zone.placeNameSub);
        }

        this.context.name = `Quest Rewards in "${name.join(', ')}"`;
        this.zoneId = zone.id;
        this.terrId = zone.territoryId;

        // In sub-zones, markers aren't updated. We need to manually trigger the update.
        this.onQuestMarkersUpdated(this.allMarkers);
    }

    @Bound private onQuestMarkersUpdated(markers: QuestMarker[])
    {
        this.allMarkers = markers;
        this.totalGilReward = 0;
        this.emoteRewards = [];
        this.skillRewards = [];
        this.itemRewards = [];

        let totalGil = 0;

        for (const marker of markers) {
            if (marker.mapId !== this.zoneId) {
                continue;
            }

            if (marker.quest.rewards.gil) {
                totalGil += marker.quest.rewards.gil;
            }

            if (marker.quest.rewards.emote) {
                this.emoteRewards.push({ marker, item: marker.quest.rewards.emote });
            }

            if (marker.quest.rewards.action) {
                this.skillRewards.push({ marker, item: marker.quest.rewards.action });
            }

            if (marker.quest.rewards.items?.length > 0) {
                for (const item of marker.quest.rewards.items) {
                    this.itemRewards.push({ marker, item });
                }
            }

            if (marker.quest.rewards.optionalItems?.length > 0) {
                for (const item of marker.quest.rewards.optionalItems) {
                    this.itemRewards.push({ marker, item });
                }
            }
        }

        this.emoteRewards.sort((a, b) => a.item.name.localeCompare(b.item.name));
        this.skillRewards.sort((a, b) => a.item.name.localeCompare(b.item.name));
        this.itemRewards.sort((a, b) => a.item.name.localeCompare(b.item.name));
        this.itemRewards.sort((a, b) => a.item.categoryName.localeCompare(b.item.categoryName));

        this.enqueueDeferredTask(() => {
            this.totalGilReward = Math.max(0, totalGil);
            this.emoteRewards = [...this.emoteRewards];
            this.skillRewards = [...this.skillRewards];
            this.itemRewards = [...this.itemRewards];
        });
    }
}

type QuestReward<T> = {
    item: T;
    marker: QuestMarker;
}