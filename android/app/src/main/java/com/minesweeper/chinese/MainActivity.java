package com.minesweeper.chinese;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // 註冊插件
        this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
            // 可以在這裡添加額外的插件
        }});
    }
}
