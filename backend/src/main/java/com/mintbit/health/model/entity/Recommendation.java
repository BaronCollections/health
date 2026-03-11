package com.mintbit.health.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@TableName(value = "recommendation", autoResultMap = true)
public class Recommendation {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private Long assessmentId;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<Map<String, Object>> supplements;  // 推荐的营养素列表

    @TableField(typeHandler = JacksonTypeHandler.class)
    private Map<String, Object> safetyCheck;  // 剂量冲突检查结果

    @TableField(typeHandler = JacksonTypeHandler.class)
    private Map<String, Object> aiInsight;  // AI 解读

    private String posterUrl;

    @TableLogic
    private Integer deleted;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
