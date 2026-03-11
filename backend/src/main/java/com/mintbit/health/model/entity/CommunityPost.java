package com.mintbit.health.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@TableName(value = "community_post", autoResultMap = true)
public class CommunityPost {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private String content;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> images;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> tags;

    private String type;  // daily, checkin, poster_share, achievement

    private Integer likeCount;

    private Integer commentCount;

    private String status;  // pending, approved, rejected

    @TableLogic
    private Integer deleted;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
