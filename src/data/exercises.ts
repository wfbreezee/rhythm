export interface Exercise {
    id: number;
    name: string;
    subtitle: string;
    description: string;
}

export const exercises: Exercise[] = [
    {
        id: 1,
        name: '马步摇',
        subtitle: '坚如磐石',
        description: '双脚与肩同宽，下蹲成马步，左右摇摆身体'
    },
    {
        id: 2,
        name: '大风车',
        subtitle: '力贯双臂',
        description: '双臂伸展，画大圆圈转动'
    },
    {
        id: 3,
        name: '左右拉筋',
        subtitle: '唤醒侧腰',
        description: '侧身拉伸，左右交替'
    },
    {
        id: 4,
        name: '旋转乾坤',
        subtitle: '灵活脊柱',
        description: '转动腰部，带动上半身旋转'
    },
    {
        id: 5,
        name: '上下齐发',
        subtitle: '协调训练',
        description: '双手上举下放，配合呼吸'
    },
    {
        id: 6,
        name: '马步旋转',
        subtitle: '下肢强化',
        description: '马步站立，转动膝盖'
    },
    {
        id: 7,
        name: '握固下拉',
        subtitle: '背薄十村',
        description: '双手握拳下拉，挺胸收背'
    },
    {
        id: 8,
        name: '踮脚甩手',
        subtitle: '放松全身',
        description: '踮脚站立，甩动双手放松'
    }
];
