import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ExerciseAnimationProps {
    exerciseId: number;
    isPlaying: boolean;
}

// 八段锦动作动画组件 - 基于传统功法动作设计
export const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({ exerciseId, isPlaying }) => {

    // 根据动作 ID 返回对应的人物姿态和动画效果
    const renderExercise = () => {
        const baseClass = "transition-all duration-300";

        switch (exerciseId) {
            case 1: // 马步摇 - 双脚宽站、左右摇摆
                return (
                    <svg viewBox="0 0 120 160" className={twMerge("w-full h-full", baseClass, isPlaying && "animate-horse-sway")}>
                        {/* 头部 */}
                        <circle cx="60" cy="25" r="16" fill="#64748b" />
                        <circle cx="55" cy="23" r="2" fill="#334155" />
                        <circle cx="65" cy="23" r="2" fill="#334155" />
                        {/* 身体 */}
                        <rect x="45" y="41" width="30" height="40" rx="5" fill="#3b82f6" />
                        {/* 手臂 - 叉腰 */}
                        <path d="M45 50 L25 65 L30 75" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />
                        <path d="M75 50 L95 65 L90 75" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />
                        {/* 腿 - 马步 */}
                        <path d="M50 81 L30 130" stroke="#1e40af" strokeWidth="8" strokeLinecap="round" />
                        <path d="M70 81 L90 130" stroke="#1e40af" strokeWidth="8" strokeLinecap="round" />
                        {/* 脚 */}
                        <ellipse cx="28" cy="135" rx="10" ry="6" fill="#334155" />
                        <ellipse cx="92" cy="135" rx="10" ry="6" fill="#334155" />
                    </svg>
                );

            case 2: // 大风车 - 双臂画圆
                return (
                    <svg viewBox="0 0 120 160" className={twMerge("w-full h-full", baseClass)}>
                        {/* 头部 */}
                        <circle cx="60" cy="25" r="16" fill="#64748b" />
                        {/* 身体 */}
                        <rect x="45" y="41" width="30" height="45" rx="5" fill="#3b82f6" />
                        {/* 左臂 - 旋转动画 */}
                        <g className={twMerge("origin-[60px_50px]", isPlaying && "animate-windmill")}>
                            <path d="M60 50 L20 30" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />
                            <circle cx="18" cy="28" r="5" fill="#f59e0b" />
                        </g>
                        {/* 右臂 - 反向旋转 */}
                        <g className={twMerge("origin-[60px_50px]", isPlaying && "animate-windmill-reverse")}>
                            <path d="M60 50 L100 70" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />
                            <circle cx="102" cy="72" r="5" fill="#f59e0b" />
                        </g>
                        {/* 腿 */}
                        <path d="M50 86 L45 130" stroke="#1e40af" strokeWidth="7" strokeLinecap="round" />
                        <path d="M70 86 L75 130" stroke="#1e40af" strokeWidth="7" strokeLinecap="round" />
                        <ellipse cx="43" cy="135" rx="8" ry="5" fill="#334155" />
                        <ellipse cx="77" cy="135" rx="8" ry="5" fill="#334155" />
                    </svg>
                );

            case 3: // 左右拉筋 - 侧身拉伸
                return (
                    <svg viewBox="0 0 120 160" className={twMerge("w-full h-full", baseClass, isPlaying && "animate-side-stretch")}>
                        {/* 头部 */}
                        <circle cx="60" cy="25" r="16" fill="#64748b" />
                        {/* 身体 */}
                        <rect x="45" y="41" width="30" height="40" rx="5" fill="#3b82f6" />
                        {/* 左手上举 */}
                        <path d="M45 50 L25 20" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />
                        <circle cx="23" cy="18" r="5" fill="#f59e0b" />
                        {/* 右手下垂 */}
                        <path d="M75 50 L85 80" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />
                        <circle cx="87" cy="82" r="5" fill="#f59e0b" />
                        {/* 腿 */}
                        <path d="M50 81 L45 130" stroke="#1e40af" strokeWidth="7" strokeLinecap="round" />
                        <path d="M70 81 L75 130" stroke="#1e40af" strokeWidth="7" strokeLinecap="round" />
                        <ellipse cx="43" cy="135" rx="8" ry="5" fill="#334155" />
                        <ellipse cx="77" cy="135" rx="8" ry="5" fill="#334155" />
                    </svg>
                );

            case 4: // 旋转乾坤 - 腰部转动
                return (
                    <svg viewBox="0 0 120 160" className={twMerge("w-full h-full", baseClass, isPlaying && "animate-torso-rotate")}>
                        {/* 头部 */}
                        <circle cx="60" cy="25" r="16" fill="#64748b" />
                        {/* 身体 */}
                        <rect x="45" y="41" width="30" height="40" rx="5" fill="#3b82f6" />
                        {/* 双手叉腰 */}
                        <path d="M45 55 L30 70" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />
                        <path d="M75 55 L90 70" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />
                        <circle cx="28" cy="72" r="5" fill="#f59e0b" />
                        <circle cx="92" cy="72" r="5" fill="#f59e0b" />
                        {/* 腿 - 站立 */}
                        <path d="M50 81 L48 130" stroke="#1e40af" strokeWidth="7" strokeLinecap="round" />
                        <path d="M70 81 L72 130" stroke="#1e40af" strokeWidth="7" strokeLinecap="round" />
                        <ellipse cx="46" cy="135" rx="8" ry="5" fill="#334155" />
                        <ellipse cx="74" cy="135" rx="8" ry="5" fill="#334155" />
                        {/* 旋转箭头指示 */}
                        <path d="M30 50 A30 30 0 0 1 90 50" stroke="#22c55e" strokeWidth="2" fill="none" strokeDasharray="4 2" className={isPlaying ? "opacity-100" : "opacity-0"} />
                    </svg>
                );

            case 5: // 上下齐发 - 双手上举下放
                return (
                    <svg viewBox="0 0 120 160" className={twMerge("w-full h-full", baseClass)}>
                        {/* 头部 */}
                        <circle cx="60" cy="30" r="16" fill="#64748b" className={twMerge(isPlaying && "animate-up-down")} />
                        {/* 身体 */}
                        <rect x="45" y="46" width="30" height="40" rx="5" fill="#3b82f6" />
                        {/* 双手上举 */}
                        <g className={twMerge(isPlaying && "animate-arms-up-down")}>
                            <path d="M45 55 L30 25" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />
                            <path d="M75 55 L90 25" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />
                            <circle cx="28" cy="23" r="5" fill="#f59e0b" />
                            <circle cx="92" cy="23" r="5" fill="#f59e0b" />
                        </g>
                        {/* 腿 */}
                        <path d="M50 86 L48 130" stroke="#1e40af" strokeWidth="7" strokeLinecap="round" />
                        <path d="M70 86 L72 130" stroke="#1e40af" strokeWidth="7" strokeLinecap="round" />
                        <ellipse cx="46" cy="135" rx="8" ry="5" fill="#334155" />
                        <ellipse cx="74" cy="135" rx="8" ry="5" fill="#334155" />
                    </svg>
                );

            case 6: // 马步旋转 - 下肢画圈
                return (
                    <svg viewBox="0 0 120 160" className={twMerge("w-full h-full", baseClass)}>
                        {/* 头部 */}
                        <circle cx="60" cy="25" r="16" fill="#64748b" />
                        {/* 身体 */}
                        <rect x="45" y="41" width="30" height="40" rx="5" fill="#3b82f6" />
                        {/* 手臂叉腰 */}
                        <path d="M45 50 L28 65" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />
                        <path d="M75 50 L92 65" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />
                        <circle cx="26" cy="67" r="5" fill="#f59e0b" />
                        <circle cx="94" cy="67" r="5" fill="#f59e0b" />
                        {/* 腿 - 马步动画 */}
                        <g className={twMerge(isPlaying && "animate-knee-rotate")}>
                            <path d="M50 81 L30 130" stroke="#1e40af" strokeWidth="8" strokeLinecap="round" />
                            <path d="M70 81 L90 130" stroke="#1e40af" strokeWidth="8" strokeLinecap="round" />
                            <ellipse cx="28" cy="135" rx="10" ry="6" fill="#334155" />
                            <ellipse cx="92" cy="135" rx="10" ry="6" fill="#334155" />
                        </g>
                        {/* 膝盖圆圈指示 */}
                        <circle cx="40" cy="105" r="8" stroke="#22c55e" strokeWidth="2" fill="none" strokeDasharray="3 2" className={isPlaying ? "opacity-100" : "opacity-0"} />
                        <circle cx="80" cy="105" r="8" stroke="#22c55e" strokeWidth="2" fill="none" strokeDasharray="3 2" className={isPlaying ? "opacity-100" : "opacity-0"} />
                    </svg>
                );

            case 7: // 握固下拉 - 双拳下拉
                return (
                    <svg viewBox="0 0 120 160" className={twMerge("w-full h-full", baseClass)}>
                        {/* 头部 */}
                        <circle cx="60" cy="25" r="16" fill="#64748b" />
                        {/* 身体 - 挺胸 */}
                        <rect x="42" y="41" width="36" height="42" rx="5" fill="#3b82f6" />
                        {/* 手臂 - 握拳下拉动画 */}
                        <g className={twMerge(isPlaying && "animate-pull-down")}>
                            <path d="M42 55 L25 85" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />
                            <path d="M78 55 L95 85" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />
                            {/* 拳头 */}
                            <rect x="18" y="82" width="12" height="10" rx="3" fill="#f59e0b" />
                            <rect x="90" y="82" width="12" height="10" rx="3" fill="#f59e0b" />
                        </g>
                        {/* 腿 */}
                        <path d="M50 83 L48 130" stroke="#1e40af" strokeWidth="7" strokeLinecap="round" />
                        <path d="M70 83 L72 130" stroke="#1e40af" strokeWidth="7" strokeLinecap="round" />
                        <ellipse cx="46" cy="135" rx="8" ry="5" fill="#334155" />
                        <ellipse cx="74" cy="135" rx="8" ry="5" fill="#334155" />
                        {/* 下拉箭头 */}
                        <path d="M60 100 L60 120 M55 115 L60 120 L65 115" stroke="#22c55e" strokeWidth="2" fill="none" className={isPlaying ? "opacity-100" : "opacity-0"} />
                    </svg>
                );

            case 8: // 踮脚甩手 - 踮脚+甩手
                return (
                    <svg viewBox="0 0 120 160" className={twMerge("w-full h-full", baseClass)}>
                        {/* 头部 */}
                        <circle cx="60" cy="25" r="16" fill="#64748b" />
                        {/* 身体 */}
                        <rect x="45" y="41" width="30" height="40" rx="5" fill="#3b82f6" />
                        {/* 手臂 - 甩手动画 */}
                        <g className={twMerge(isPlaying && "animate-arm-shake")}>
                            <path d="M45 55 L20 70" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />
                            <path d="M75 55 L100 70" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />
                            <circle cx="18" cy="72" r="5" fill="#f59e0b" />
                            <circle cx="102" cy="72" r="5" fill="#f59e0b" />
                        </g>
                        {/* 腿 */}
                        <path d="M50 81 L50 120" stroke="#1e40af" strokeWidth="7" strokeLinecap="round" />
                        <path d="M70 81 L70 120" stroke="#1e40af" strokeWidth="7" strokeLinecap="round" />
                        {/* 脚 - 踮脚动画 */}
                        <g className={twMerge(isPlaying && "animate-foot-tiptoe")}>
                            <ellipse cx="50" cy="128" rx="8" ry="5" fill="#334155" />
                            <ellipse cx="70" cy="128" rx="8" ry="5" fill="#334155" />
                        </g>
                    </svg>
                );

            default:
                return null;
        }
    };

    return (
        <div className="relative w-28 h-36 flex items-center justify-center">
            {renderExercise()}
        </div>
    );
};
