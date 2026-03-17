package com.mintbit.health.model.dto.miniprogram;

import lombok.Data;

@Data
public class MiniProgramBindRequest {

    private String phone;
    private String smsCode;
    private String bindToken;
}
