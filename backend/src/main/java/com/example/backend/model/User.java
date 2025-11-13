package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @Column(name = "email", nullable = false, unique = true)
    private @Getter @ Setter String email;
    @Column(name = "password", nullable = false)
    private @Getter @Setter String password;
    @Column(name = "username", nullable = false, unique = true)
    private @Getter @Setter String username;
    @Column(name = "nr_focus_sessions", nullable = false)
    private @Getter @Setter int nrFocusSessions;
    @Column(name = "total_focus_time", nullable = false)
    private @Getter @Setter int totalFocusTime;
    @Column(name = "nr_focus_sessions_today", nullable = false)
    private @Getter @Setter int nrFocusSessionsToday;
    @Column(name = "focus_time_today", nullable = false)
    private @Getter @Setter String focusTimeToday;
    @Column(name = "avatar", nullable = false)
    private @Getter @Setter String avatar;

    public User(String email, String password, String username, int nrFocusSessions, int totalFocusTime, int nrFocusSessionsToday, String focusTimeToday, String avatar) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.nrFocusSessions = nrFocusSessions;
        this.totalFocusTime = totalFocusTime;
        this.nrFocusSessionsToday = nrFocusSessionsToday;
        this.focusTimeToday = focusTimeToday;
        this.avatar = avatar;
    }

    
}