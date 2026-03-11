package com.mintbit.health.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@TableName(value = "assessment", autoResultMap = true)
public class Assessment {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private String ageGroup;

    private String status;  // in_progress, completed, expired

    @TableField(typeHandler = JacksonTypeHandler.class)
    private Map<String, Object> answers;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private Map<String, Object> ocrData;

    private Integer healthScore;

    @TableLogic
    private Integer deleted;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
