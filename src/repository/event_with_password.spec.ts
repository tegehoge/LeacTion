import { Event } from "../models/event";

test("assign", () => {
  const event = new Event("sample", "2020-10-01");
  const obj = Object.assign({}, event, { password: "tegehoge" });
  expect(obj.password).toBe("tegehoge");
  expect(Object.prototype.hasOwnProperty.call(event, "password")).toBeFalsy();
});
