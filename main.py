import os
import argparse
import asyncio
from datetime import datetime
from dotenv import load_dotenv
import gfwapiclient as gfw

# 載入環境變數
load_dotenv()
api_key = os.getenv("API_KEY")

async def query_vessel_data(mmsi: str, start_date_str: str, end_date_str: str):
    if not api_key:
        print("❌ 找不到 API_KEY，請確認 .env 檔案中是否已設定。")
        return

    print(f"=== 開始查詢 MMSI: {mmsi} ===")
    print(f"指定時間區間: {start_date_str} ~ {end_date_str}\n")

    gfw_client = gfw.Client(access_token=api_key)

    # ==========================================
    # 1. 取得詳細資料 (Vessel Details)
    # ==========================================
    print("1. 正在搜尋船隻詳細資料...")
    try:
        vessel_search_result = await gfw_client.vessels.search_vessels(query=mmsi)
        
        vessel_ids = []
        vessel_details = []
        
        for item in vessel_search_result.data():
            for info in item.self_reported_info:
                if info.id and info.ship_name:
                    vessel_ids.append(info.id)
                    vessel_details.append({
                        "Vessel ID": info.id,
                        "船名 (Ship Name)": info.ship_name,
                        "MMSI": info.ssvid,
                        "國籍 (Flag)": info.flag,
                        "IMO": info.imo
                    })
                    
        if not vessel_ids:
            print("❌ 找不到符合條件的船舶。")
            return
            
        target_vessel_id = vessel_ids[0]
        print(f"✅ 找到 {len(vessel_details)} 筆資料，使用主要 Vessel ID: {target_vessel_id}\n")
        
        # 整理輸出格式為表格
        print(f"  {'船名 (Ship Name)':<20} | {'MMSI':<10} | {'國籍 (Flag)':<12} | {'IMO':<10} | {'Vessel ID'}")
        print("  " + "-" * 85)
        for detail in vessel_details:
            ship_name = str(detail.get("船名 (Ship Name)") or "")
            mmsi_val = str(detail.get("MMSI") or "")
            flag_val = str(detail.get("國籍 (Flag)") or "")
            imo_val = str(detail.get("IMO") or "")
            vid_val = str(detail.get("Vessel ID") or "")
            
            print(f"  {ship_name:<20} | {mmsi_val:<10} | {flag_val:<12} | {imo_val:<10} | {vid_val}")
    except Exception as e:
        print(f"❌ 搜尋船舶詳細資料時發生錯誤: {e}")
        return

    print("\n" + "="*40 + "\n")

    # 處理時間格式
    try:
        # 轉換為 UTC 格式以供 Events API 使用
        start_dt_utc = f"{start_date_str}T00:00:00Z"
        end_dt_utc = f"{end_date_str}T23:59:59Z"
        
        # 轉換為 datetime.date 對象以供 Insights API 使用
        start_dt_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        end_dt_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
    except ValueError:
        print("❌ 日期格式錯誤，請確保輸入格式為 YYYY-MM-DD。")
        return

    # ==========================================
    # 2. 取得歷史記錄/洞察 (Insights)
    # ==========================================
    print("2. 正在查詢 Insights (捕撈行為洞察)...")
    dataset_id = "public-global-vessel-identity:latest"
    try:
        insights_result = await gfw_client.insights.get_vessel_insights(
            includes=["FISHING"],
            start_date=start_dt_date,
            end_date=end_dt_date,
            vessels=[{"dataset_id": dataset_id, "vessel_id": target_vessel_id}],
        )
        insights_df = insights_result.df()
        if insights_df is not None and not insights_df.empty:
            print("✅ Insights 摘要結果:\n")
            records = insights_df.to_dict('records')
            for idx, record in enumerate(records, 1):
                print(f"  [洞察紀錄 {idx}]")
                for key, val in record.items():
                    if val is None or str(val) == 'nan':
                        continue
                    if isinstance(val, dict):
                        print(f"    🔹 {key}:")
                        for sub_k, sub_v in val.items():
                            print(f"       - {sub_k:<42}: {sub_v}")
                    else:
                        print(f"    🔹 {key:<15}: {val}")
                print()
        else:
            print("⚠️ 該時間區間內沒有 Insights 資料。")
    except Exception as e:
        print(f"❌ 查詢 Insights 時發生錯誤: {e}")

    print("\n" + "="*40 + "\n")

    # ==========================================
    # 3. 取得事件 (Events)
    # ==========================================
    print("3. 正在查詢事件清單 (Events)...")
    try:
        events_result = await gfw_client.events.get_all_events(
            datasets=[
                "public-global-encounters-events:latest",
                "public-global-fishing-events:latest",
                "public-global-loitering-events:latest",
                "public-global-port-visits-events:latest"
            ],
            vessels=[target_vessel_id],
            start_date=start_dt_date,
            end_date=end_dt_date,
            limit=50  # 可自行調整顯示數量
        )
        
        events_data = events_result.data() if hasattr(events_result, "data") else events_result
        
        if not events_data:
            print("⚠️ 該時間區間內找不到任何事件紀錄。")
        else:
            print(f"✅ 共找到 {len(events_data)} 筆事件紀錄：\n")
            print(f"  {'編號':<4} | {'事件類型':<14} | {'開始時間':<20} | {'結束時間':<20}")
            print("  " + "-" * 68)
            for idx, event in enumerate(events_data, 1):
                event_type = getattr(event, 'type', 'Unknown')
                start_time = getattr(event, 'start', '')
                end_time = getattr(event, 'end', '')
                
                # 整理時間格式，去除不必要的微秒或 T 符號
                if hasattr(start_time, 'strftime'): 
                    start_time = start_time.strftime('%Y-%m-%d %H:%M:%S')
                elif isinstance(start_time, str): 
                    start_time = start_time[:19].replace('T', ' ')
                    
                if hasattr(end_time, 'strftime'): 
                    end_time = end_time.strftime('%Y-%m-%d %H:%M:%S')
                elif isinstance(end_time, str): 
                    end_time = end_time[:19].replace('T', ' ')

                print(f"  [{idx:02d}] | {str(event_type):<14} | {start_time:<20} | {end_time:<20}")
            
    except Exception as e:
        print(f"❌ 查詢 Events 時發生錯誤: {e}")

def main():
    parser = argparse.ArgumentParser(description="GFW API 船隻詳細資料與事件查詢工具")
    parser.add_argument("-m", "--mmsi", type=str, help="目標船舶的 MMSI")
    parser.add_argument("-s", "--start", type=str, help="開始日期，格式 YYYY-MM-DD")
    parser.add_argument("-e", "--end", type=str, help="結束日期，格式 YYYY-MM-DD")
    
    args = parser.parse_args()

    mmsi = args.mmsi
    if not mmsi:
        mmsi = input("輸入MMSI (直接 Enter 預設為 416007069): ").strip()
        if not mmsi:
            mmsi = "416007069"

    start_date = args.start
    if not start_date:
        start_date = input("輸入開始日期 YYYY-MM-DD (直接 Enter 預設為 2024-01-01): ").strip()
        if not start_date:
            start_date = "2024-01-01"

    end_date = args.end
    if not end_date:
        end_date = input("輸入結束日期 YYYY-MM-DD (直接 Enter 預設為 2024-12-31): ").strip()
        if not end_date:
            end_date = "2024-12-31"

    # 執行非同步主程式
    asyncio.run(query_vessel_data(mmsi, start_date, end_date))

if __name__ == "__main__":
    main()
