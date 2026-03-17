package com.mintbit.health.service;

import com.mintbit.health.model.dto.miniprogram.MiniProgramBindResponse;
import com.mintbit.health.model.dto.miniprogram.MiniProgramLoginResponse;
import com.mintbit.health.model.dto.miniprogram.MiniProgramSmsSendResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MockMiniProgramAuthServiceTest {

    private final MockMiniProgramAuthService service = new MockMiniProgramAuthService();

    @Test
    void loginReturnsBindRequiredForUnboundWeChatIdentity() {
        MiniProgramLoginResponse response = service.login("wx-code-bind");

        assertTrue(response.getBindRequired());
        assertNotNull(response.getBindToken());
        assertNull(response.getAccessToken());
        assertNull(response.getRefreshToken());
        assertNotNull(response.getProfile());
        assertFalse(response.getProfile().getPhoneBound());
    }

    @Test
    void sendSmsMasksPhoneAndReturnsCooldownMetadata() {
        MiniProgramSmsSendResponse response = service.sendSmsCode("13800138000");

        assertEquals("sent", response.getStatus());
        assertEquals(60, response.getCooldownSeconds());
        assertEquals("138****8000", response.getMaskedPhone());
    }

    @Test
    void bindPhoneReturnsAuthenticatedSession() {
        MiniProgramBindResponse response = service.bindPhone("13800138000", "123456", "bind-token-001");

        assertNotNull(response.getAccessToken());
        assertNotNull(response.getRefreshToken());
        assertNotNull(response.getProfile());
        assertEquals("13800138000", response.getProfile().getPhone());
        assertTrue(response.getProfile().getPhoneBound());
    }
}
